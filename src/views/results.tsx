import { Button, Popconfirm } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CandidateCard } from "../components/candidate-card";
import { Header } from "../components/header";
import { ResultsList } from "../components/results-list";
import { rootStore } from "../stores/root.store";
import { PDFUpload, Routes } from "../utils/types";
import { useRootStore } from "../utils/use-root-store";

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

  const fileIds = store.sortResult ?? [];

  const [selectedId, setSelectedId] = useState<null | string>(
    fileIds[0] ?? null
  );

  const onSelect = (itemID: string): void => {
    setSelectedId(itemID);
  };

  const onReset = () => {
    store.deleteAll();
    store.setRoute(Routes.UPLOAD);
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
      <Header
        title="Results"
        button={[
          <Button
            size="large"
            type="dashed"
            onClick={() => rootStore.sortCandidates()}
          >
            Sort Again
          </Button>,
          <Popconfirm title="Are you sure?" onConfirm={onReset}>
            <Button size="large" type="primary">
              Start Over
            </Button>
          </Popconfirm>,
        ]}
      />
      <ContentWrapper>
        <ResultsList fileIds={fileIds} onSelectItem={onSelect} />
        <CandidateCard data={selectedFile} enableLinks></CandidateCard>
      </ContentWrapper>
    </>
  );
});
