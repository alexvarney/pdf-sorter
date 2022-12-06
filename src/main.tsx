import React from "react";
import ReactDOM from "react-dom/client";
// import { pdfjs } from "react-pdf/dist/esm/entry.vite";
import App from "./app";
import "./index.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
