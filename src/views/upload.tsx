import { Button } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { FileUploader } from "../components/file-upload";
import { Header } from "../components/header";
import { UploadList } from "../components/upload-list";
import { PDFUpload } from "../utils/types";

const ListContainer = styled.div`
  width: clamp(250px, 50vw, 512px);
  margin: 0 auto;
`;

export const UploadView = () => {
  const [files, setFiles] = useState<PDFUpload[]>([]);
  const appendFiles = (_files: PDFUpload[]) =>
    setFiles((prev) => [...prev, ..._files]);

  return (
    <div>
      <Header
        title="Upload PDFs"
        subtitle="Get started by uploading PDFs"
        button={
          <Button type="primary" size="large">
            Next
          </Button>
        }
      ></Header>
      <FileUploader onUpload={appendFiles} />
      <ListContainer>
        <UploadList files={files} />
      </ListContainer>
    </div>
  );
};
