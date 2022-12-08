import { clear, del, get, getMany, set, setMany } from "idb-keyval";
import { debounce } from "lodash";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { sortAsync } from "../utils/async-sort";
import {
  METADATA_KEY,
  PDFMetadata,
  PDFUpload,
  QueuedComparison,
  Routes,
  STATE_KEY,
} from "../utils/types";

type SavedState = Pick<RootStore, "_sortResult" | "_route">;

export class RootStore {
  _route = Routes.UPLOAD;

  _metadata: Record<string, PDFMetadata> = {};
  _loadedFiles: Record<string, PDFUpload["array"]> = {};
  _queuedComparisons: QueuedComparison[] = [];
  _sortResult: string[] | null = null;

  _abortController: AbortController;

  constructor() {
    makeAutoObservable(this);

    this.loadMetadata();
    this.loadState().then((state) => {
      if (!state) {
        this.setRoute(Routes.UPLOAD);
        return;
      }

      const { _route, _sortResult } = state;

      this.setRoute(_route);
      this.setSortResult(_sortResult);

      if (_route === Routes.SORT) {
        this.sortCandidates();
      }
    });

    this._abortController = new window.AbortController();

    reaction(
      () => {
        return Object.values(this.metadata).reduce((acc, curr) => {
          return acc + curr.name;
        }, "");
      },
      () => {
        this.debouncedSave();
      }
    );

    reaction(
      () => [this.route, this.sortResult],
      () => {
        console.log("save state");
        this.saveState();
      }
    );
  }

  get route(): Routes {
    return this._route;
  }

  setRoute(value: Routes) {
    this._route = value;
  }

  async addPdfFiles(...uploads: PDFUpload[]) {
    const idbInsert = uploads.map(
      (item) => [item.id, item.array] as [string, Uint8Array]
    );

    const metadata = uploads.map((item) => {
      const modified: Partial<PDFUpload> = { ...item };
      delete modified.array;
      return modified as PDFMetadata;
    });

    console.log("adding " + JSON.stringify(metadata));

    metadata.forEach((upload) => (this._metadata[upload.id] = { ...upload }));

    return setMany(idbInsert);
  }

  get metadata() {
    return this._metadata;
  }

  async loadMetadata() {
    const vals = await get(METADATA_KEY);

    this._metadata = JSON.parse(vals ?? "{}");
  }

  async saveMetadata() {
    return set(METADATA_KEY, JSON.stringify(this.metadata));
  }

  async loadState(): Promise<SavedState | null> {
    const vals = await get(STATE_KEY);

    if (!vals) return null;

    return JSON.parse(vals) as SavedState;
  }

  async saveState() {
    await set(
      STATE_KEY,
      JSON.stringify({ _route: this._route, _sortResult: this._sortResult })
    );
  }

  debouncedSave = debounce(this.saveMetadata, 500);

  setPdfName(pdfId: string, name: string) {
    if (this._metadata[pdfId]) {
      this._metadata[pdfId].name = name;
    }
  }

  async loadSavedFiles(ids: string[]) {
    const results = await getMany(ids);

    if (results.length !== ids.length) return;

    runInAction(() => {
      this._loadedFiles = ids.reduce((acc, currId, idx) => {
        acc[currId] = results[idx];

        return acc;
      }, {} as Record<string, Uint8Array>);
    });
  }

  get loadedFiles() {
    return Object.entries(this._loadedFiles).reduce((acc, curr) => {
      const [key, value] = curr;

      acc[key] = {
        ...this.metadata[key],
        array: value,
      };

      return acc;
    }, {} as Record<string, PDFUpload>);
  }

  deleteAll() {
    this._metadata = {};
    this._loadedFiles = {};
    clear();
    this.saveMetadata();
  }

  async deleteFile(fileId: string) {
    delete this._metadata[fileId];
    return del(fileId);
  }

  get currentComparison(): QueuedComparison | undefined {
    return this._queuedComparisons[0];
  }

  /**
   * Provide a comparison for the current queued item.
   * @param value - Boolean indicating if the first item is preferable to the second.
   */
  provideComparatorResult(value: boolean) {
    if (this.currentComparison) {
      this.currentComparison?.resolver(value);
      this._queuedComparisons.shift();
    } else {
      console.error(
        "No values to compare, did you mean to call provideComparisonResult?"
      );
    }
  }

  appendToQueue(item: QueuedComparison) {
    this._queuedComparisons.push(item);
  }

  cleanupSort() {
    this._abortController.abort();
    this._queuedComparisons = [];
  }

  sortCandidates = async () => {
    this.setRoute(Routes.SORT);
    this.cleanupSort();

    const ids = Object.keys(this.metadata);

    const comparator = async (a: string, b: string) => {
      const promise = new Promise<boolean>((resolver, reject) => {
        this.appendToQueue({
          comparison: [a, b],
          resolver,
        });

        this._abortController.signal.addEventListener("abort", () => {
          reject("Cancelling sort");
        });
      });

      const result = await promise;

      return result;
    };

    try {
      const result = await sortAsync(ids, comparator);
      this.setSortResult(result);
      this.setRoute(Routes.RESULTS);
    } catch {
      console.log("caught cancel sort");
    }
  };

  get sortResult() {
    return this._sortResult;
  }

  setSortResult(vals: string[] | null) {
    this._sortResult = vals;
  }
}

export const rootStore: RootStore = new RootStore();

(window as any).rootStore = rootStore;
