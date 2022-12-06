import { Button } from "antd";
import { FileUploader } from "../components/file-upload";
import { Header } from "../components/header";

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
