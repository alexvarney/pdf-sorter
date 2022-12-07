import { observer } from "mobx-react-lite";
import { Button } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CandidateCard } from "../components/candidate-card";
import { Header } from "../components/header";
import { ResultsList } from "../components/results-list";
import { PDFUpload } from "../utils/types";
import { useRootStore } from "../utils/use-root-store";
import { CSVLink } from "react-csv"

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: 1.5fr 2fr;
  }
  grid-gap: 2rem;

`;

export const ResultsView = observer(() => {
  const store = useRootStore();

  const fileIds = Object.keys(store.metadata);

  const [selectedId, setSelectedId] = useState<null | string>(
    fileIds[0] ?? null
  );

  const onSelect = (itemID: string): void => {
    setSelectedId(itemID);
  };

  useEffect(() => {
    if (selectedId) {
      store.loadSavedFiles([selectedId]);
    }
  }, [selectedId, store]);

  const selectedFile: PDFUpload | undefined =
    store.loadedFiles[selectedId ?? ""];

  return (
    <>
      <div>
        <Header title="Results" />
      </div>
      <ContentWrapper>
        <ResultsList fileIds={fileIds} onSelectItem={onSelect} />
        <CandidateCard data={selectedFile}></CandidateCard>
      </ContentWrapper>
    </>
  );
});
