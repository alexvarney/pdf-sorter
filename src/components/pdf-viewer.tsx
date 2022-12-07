import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
//@ts-ignore
import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import styled from "styled-components";

const Wrapper = styled.div<{ $width: number }>`
  width: ${(props) => props.$width}px;
`;

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
      <Wrapper $width={width} className={className}>
        <Document file={{ data: data }} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages > 0 ? (
            Array.from({ length: numPages }).map((v, i) => (
              <Page
                key={`${documentId}${i}`}
                width={width}
                pageNumber={i + 1}
              ></Page>
            ))
          ) : (
            <></>
          )}
        </Document>
      </Wrapper>
    );
  }
)``;
