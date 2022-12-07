import { Button, Upload } from "antd";
import { nanoid } from "nanoid";
import { VscFilePdf } from "react-icons/vsc";
import styled from "styled-components";
import { PDFUpload } from "../utils/types";

const DropContainer = styled.div`
  width: clamp(250px, 60vw, 768px);
  height: 256px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light-grey);

  //dashed border
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='rgba(0,0,0,0.15)' stroke-width='3' stroke-dasharray='8%2c 16%2c 8%2c 16' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 16px;

  & > h6 {
    font-weight: lighter;
    margin: 1em;
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;

  & > span {
    margin-right: 0.125rem;
  } 
`;

type UploadHandler = (values: PDFUpload[]) => void;

export const FileUploader = ({ onUpload }: { onUpload: UploadHandler }) => {
  const handleUpload = async (uploadedFiles: File[]) => {
    const values = await Promise.all(
      uploadedFiles.map(async (file) => {
        const array = await file
          .arrayBuffer()
          .then((res) => new Uint8Array(res));
        const extensionRemoveRegex = /(.*)\.[^.]+$/;
        var fileName = extensionRemoveRegex.exec(file.name)![1];

        return {
          id: nanoid(),
          name: fileName,
          array,
        };
      })
    );

    onUpload(values);
  };

  return (
    <>
      <Upload
        customRequest={(options) => handleUpload([options.file as File])}
        showUploadList={false}
        multiple={true}
        accept="application/pdf"
      >
        <DropContainer>
          <StyledButton type="dashed" name="file-upload">
            <span>Upload PDFs</span> <VscFilePdf></VscFilePdf>
          </StyledButton>
          <h6>or drag and drop files here.</h6>
        </DropContainer>
      </Upload>
    </>
  );
};
