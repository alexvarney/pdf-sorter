import { Button, Input, List, Modal } from "antd";
import { useState } from "react";
import { PDFUpload } from "../utils/types";
import { PDFViewer } from "./pdf-viewer";

export const UploadList = ({ files }: { files: PDFUpload[] }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const selectedFile = files.find((files) => files.id === selectedFileId);

  const closeModal = () => setSelectedFileId(null);

  console.log(selectedFile, selectedFileId);

  return (
    <>
      <Modal
        open={selectedFile != undefined}
        onOk={closeModal}
        onCancel={closeModal}
        width={"768px"}
      >
        <div style={{ width: "700px", margin: "0 auto" }}>
          <PDFViewer data={selectedFile?.array} width={700} />
        </div>
      </Modal>
      <List
        size="large"
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered
        dataSource={files}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setSelectedFileId(item.id)}>
                View
              </Button>,
              <Button type="link" danger>
                Delete
              </Button>,
            ]}
          >
            <Input value={item.name}></Input>
            {/* <span>{item.id}</span> */}
          </List.Item>
        )}
      />
    </>
  );
};
