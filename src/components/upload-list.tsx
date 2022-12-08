import { Button, Input, List, Modal } from "antd";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useRootStore } from "../utils/use-root-store";
import { PDFViewer } from "./pdf-viewer";

export const UploadList = observer(() => {
  const store = useRootStore();
  const fileIds = Object.keys(store.metadata);

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const showFile = (fileId: string) => {
    store.loadSavedFiles([fileId]);
    setSelectedFileId(fileId);
  };

  const selectedFile = store.loadedFiles[selectedFileId ?? ""];

  const closeModal = () => setSelectedFileId(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileId: string
  ) => {
    store.setPdfName(fileId, event.target.value);
  };

  return (
    <>
      <Modal
        open={selectedFile != undefined}
        onOk={closeModal}
        onCancel={closeModal}
        width={"768px"}
      >
        <div style={{ width: "700px", margin: "0 auto" }}>
          <PDFViewer data={selectedFile?.array} width={700} enableLinks />
        </div>
      </Modal>
      <List
        size="large"
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered
        dataSource={fileIds}
        renderItem={(itemId) => (
          <ListItem
            itemId={itemId}
            handleInputChange={handleInputChange}
            setSelectedFileId={(id) => {
              if (id) showFile(id);
            }}
          />
        )}
      />
    </>
  );
});

const ListItem = observer(
  (props: {
    itemId: string;
    handleInputChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      fileId: string
    ) => void;
    setSelectedFileId: (s: string) => void;
  }) => {
    const store = useRootStore();
    const { itemId, handleInputChange, setSelectedFileId } = props;
    return (
      <List.Item
        actions={[
          <Button type="link" onClick={() => setSelectedFileId(itemId)}>
            View
          </Button>,
          <Button type="link" danger onClick={() => store.deleteFile(itemId)}>
            Delete
          </Button>,
        ]}
      >
        <Input
          onChange={(e) => handleInputChange(e, itemId)}
          value={store.metadata[itemId]?.name}
        ></Input>
        {/* <span>{item.id}</span> */}
      </List.Item>
    );
  }
);
