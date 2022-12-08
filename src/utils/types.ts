export enum Routes {
  UPLOAD,
  SORT,
  RESULTS,
}

export interface PDFUpload {
  name: string;
  filename: string;
  id: string;
  array: Uint8Array;
}
export type PDFMetadata = Omit<PDFUpload, "array">;

export const METADATA_KEY: "__metadata" = "__metadata";
export const STATE_KEY: "__state" = "__state";

export interface QueuedComparison {
  comparison: [string, string];
  resolver: (value: boolean | PromiseLike<boolean>) => void;
}
