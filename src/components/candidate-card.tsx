import styled from "styled-components";
import { PDFUpload } from "../utils/types";
import { PDFViewer } from "./pdf-viewer";

const CandidateCardWrapper = styled.div`
  padding: 1em;
  width: 700px;
  background-color: --blue;
  & > div {
    height: 640px;
    overflow-y: scroll;
  }
`;

export const CandidateCard = ({ data }: { data: PDFUpload }) => {
  return (
    <CandidateCardWrapper>
      <PDFViewer data={data.array} width={700} />
    </CandidateCardWrapper>
  );
};
