import { useState } from "react";

//@ts-ignore
import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import "react-pdf/dist/esm/Page/TextLayer.css";

export const PDFViewer = ({ data }: { data: Uint8Array }) => {
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("Loaded a file with " + numPages + " pages!");
    setNumPages(numPages);
  }

  console.log(data);

  if (!data) return <></>;

  return (
    <>
      <p>Num Pages: {numPages}</p>
      <Document file={{ data: data }} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1}></Page>
      </Document>
    </>
  );
};
