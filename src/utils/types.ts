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
