import { Button } from "antd";
import { FileUploader } from "../components/FileUpload";
import { Header } from "../components/Header";

export const UploadView = () => {
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
      <FileUploader />
    </div>
  );
};
