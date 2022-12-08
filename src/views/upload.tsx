import { Button } from "antd";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { FileUploader } from "../components/file-upload";
import { Header } from "../components/header";
import { UploadList } from "../components/upload-list";
import { rootStore } from "../stores/root.store";
import { PDFUpload } from "../utils/types";
import { useRootStore } from "../utils/use-root-store";

const ListContainer = styled.div`
  width: clamp(250px, 50vw, 512px);
  margin: 32px auto 0;
`;

export const UploadView = observer(() => {
  const store = useRootStore();

  const appendFiles = (_files: PDFUpload[]) => store.addPdfFiles(..._files);

  const isSortable = Object.keys(store.metadata).length > 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Header
        title="PDF Sorter"
        subtitle="Get started by selecting files"
        button={[
          <Button
            disabled={!isSortable}
            size="large"
            danger
            onClick={() => rootStore.deleteAll()}
          >
            Reset
          </Button>,
          <Button
            disabled={!isSortable}
            type="primary"
            size="large"
            onClick={() => store.sortCandidates()}
          >
            Next
          </Button>,
        ]}
      ></Header>
      <FileUploader onUpload={appendFiles} />
      <ListContainer>
        <UploadList />
      </ListContainer>
    </div>
  );
});
