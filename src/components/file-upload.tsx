import { Button, Upload } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { VscFilePdf } from 'react-icons/vsc';
import styled from 'styled-components';
import { PDFUpload } from '../utils/types';

const DropContainer = styled.div`
  width: clamp(250px, 60vw, 768px);
  height: 256px;
  margin: 0 auto 32px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light-grey);

  //dashed border
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='rgba(0,0,0,0.15)' stroke-width='3' stroke-dasharray='8%2c 16%2c 8%2c 16' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 16px;
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
      uploadedFiles.map(async file => {
        const arrayBuffer = await file.arrayBuffer();
        const array = new Uint8Array(arrayBuffer);
        const id = nanoid();

        return {
          id,
          name: file.name,
          array,
        };
      })
    );

    onUpload(values);
  };

  const handleFileDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.dataTransfer.items) return;

    const files: File[] = [...event.dataTransfer.items]
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile())
      .filter((item): item is File => item != null);

    handleUpload(files);
  };

  return (
    <>
      <DropContainer
        onDragOver={e => e.preventDefault()}
        onDrop={handleFileDrag}
      >
        <Upload
          customRequest={options => handleUpload([options.file as File])}
          showUploadList={false}
          multiple={true}
          accept="application/pdf"
        >
          <StyledButton type="dashed">
            <span>Upload PDFs</span> <VscFilePdf></VscFilePdf>
          </StyledButton>
        </Upload>
      </DropContainer>
    </>
  );
};
