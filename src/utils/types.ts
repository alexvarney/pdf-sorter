export enum Routes {
  UPLOAD,
  SORT,
  RESULTS,
}

export interface PDFUpload {
  name: string;
  id: string;
  array: Uint8Array;
}
export type PDFMetadata = Omit<PDFUpload, "array">;

export const METADATA_KEY: "__metadata" = "__metadata";
