import { clear, del, get, getMany, set, setMany } from "idb-keyval";
import { debounce } from "lodash";
import { makeAutoObservable, reaction } from "mobx";
import { METADATA_KEY, PDFMetadata, PDFUpload, Routes } from "../utils/types";
export class RootStore {
  _route = Routes.UPLOAD;

  _metadata: Record<string, PDFMetadata> = {};
  _loadedFiles: Record<string, PDFUpload["array"]> = {};

  constructor() {
    makeAutoObservable(this);
    this.loadMetadata();

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

  debouncedSave = debounce(this.saveMetadata, 500);

  setPdfName(pdfId: string, name: string) {
    if (this._metadata[pdfId]) {
      this._metadata[pdfId].name = name;
    }
  }

  async loadSavedFiles(ids: string[]) {
    const results = await getMany(ids);

    if (results.length !== ids.length) return;

    this._loadedFiles = ids.reduce((acc, currId, idx) => {
      acc[currId] = results[idx];

      return acc;
    }, {} as Record<string, Uint8Array>);
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
}

export const rootStore: RootStore = new RootStore();

(window as any).rootStore = rootStore;
