import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
//@ts-ignore
import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import styled from "styled-components";

export const PDFViewer = styled(
  ({
    data,
    className,
    width,
  }: {
    data?: Uint8Array;
    width: number;
    className?: string;
  }) => {
    const [numPages, setNumPages] = useState(0);
    const [documentId, setDocumentId] = useState<string | null>(null);

    function onDocumentLoadSuccess(data: PDFDocumentProxy) {
      setNumPages(data.numPages);
      setDocumentId(data.fingerprints[0]);
    }

    return (
      <div style={{ width: `${width}px` }} className={className}>
        <p>{documentId}</p>
        <Document
          file={{ data: data }}
          onLoadSuccess={(e) => onDocumentLoadSuccess(e)}
        >
          {numPages > 0 ? (
            Array.from({ length: numPages }).map((v, i) => (
              <Page
                key={`${documentId}${i}`}
                pageNumber={i + 1}
                width={width}
              ></Page>
            ))
          ) : (
            <></>
          )}
        </Document>
      </div>
    );
  }
)``;
