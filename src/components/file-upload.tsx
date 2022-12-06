import { Button } from "antd";
import React, { useState } from "react";
import { VscFilePdf } from "react-icons/vsc";
import styled from "styled-components";
import { PDFViewer } from "./pdf-viewer";

const DropContainer = styled.div`
  width: 50vw;
  height: 256px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light-grey);
  // border-style: dashed;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;

  & > span {
    margin-right: 0.125rem;
  }
`;

export const FileUploader = () => {
  const [fileValues, setFileValues] = useState<Uint8Array[]>();

  console.log("hello from file uploader");

  const handleUpload = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files: File[] = [];

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...event.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();

          if (file) {
            files.push(file);
          }

          console.log(`… file[${i}].name = ${file?.name}`);
        }
      });
    }

    const values = await Promise.all(
      files.map((file) => file.arrayBuffer().then((res) => new Uint8Array(res)))
    );

    setFileValues(values);
  };

  return (
    <>
      <DropContainer
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleUpload}
      >
        <StyledButton type="dashed">
          <span>Upload PDFs</span> <VscFilePdf></VscFilePdf>
        </StyledButton>
      </DropContainer>
      <div style={{ height: "200px" }}>
        {fileValues?.length && (
          <PDFViewer data={fileValues[fileValues.length - 1]} />
        )}
      </div>
    </>
  );
};
