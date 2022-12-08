import { Button as _Button } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CandidateCard } from "../components/candidate-card";
import { Header } from "../components/header";
import { Routes } from "../utils/types";
import { useRootStore } from "../utils/use-root-store";
const Button = styled(_Button)``;

const SortWrapper = styled.div`
  flex: 1;

  display: grid;

  grid-template-columns: 1fr 15% 1fr;
  gap: 32px;

  & > ${Button} {
    height: 100%;
  }
`;

export const SortView = observer(() => {
  const rootStore = useRootStore();
  const comparison = rootStore.currentComparison;

  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (comparison) {
      const isLoaded = comparison.comparison.every(
        (id) => rootStore.loadedFiles[id] != undefined
      );

      if (!isLoaded) {
        rootStore.loadSavedFiles(comparison.comparison);
      }
    }
  }, [rootStore, comparison]);

  const pdfA = comparison
    ? rootStore.loadedFiles[comparison.comparison[0]]
    : undefined;
  const pdfB = comparison
    ? rootStore.loadedFiles[comparison.comparison[1]]
    : undefined;

  const handleButtonClick = () => {
    if (!!selectedCandidate) {
      const didSelectA = selectedCandidate === pdfA?.id;

      rootStore.provideComparatorResult(didSelectA);
      setSelectedCandidate(null);
    }
  };

  return (
    <>
      <Header
        title="Sort Files"
        button={[
          <Button
            type="dashed"
            size="large"
            danger
            onClick={() => rootStore.setRoute(Routes.UPLOAD)}
          >
            Restart
          </Button>,
        ]}
      ></Header>

      <SortWrapper>
        <CandidateCard
          data={pdfA}
          isSelected={!!selectedCandidate && selectedCandidate === pdfA?.id}
          onClick={() => setSelectedCandidate(pdfA?.id ?? null)}
        />
        <Button
          disabled={!comparison || !selectedCandidate}
          onClick={() => handleButtonClick()}
          type="primary"
          ghost
        >
          Next
        </Button>
        <CandidateCard
          data={pdfB}
          isSelected={!!selectedCandidate && selectedCandidate === pdfB?.id}
          onClick={() => setSelectedCandidate(pdfB?.id ?? null)}
        />
      </SortWrapper>
    </>
  );
});
