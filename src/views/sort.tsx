import { Button as _Button } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { CandidateCard } from "../components/candidate-card";
import { Header } from "../components/header";
import { useRootStore } from "../utils/use-root-store";

const Button = styled(_Button)``;

const SortWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 15% 1fr;
  gap: 32px;
  align-items: stretch;

  & > ${Button} {
    height: 100%;
  }
`;

export const SortView = observer(() => {
  const rootStore = useRootStore();
  const candidates = Object.keys(rootStore.metadata);
  const comparison = rootStore.currentComparison;

  const [isSorting, setIsSorting] = useState(false);
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

  const pdfA = rootStore.loadedFiles[comparison?.comparison[0] ?? ""];
  const pdfB = rootStore.loadedFiles[comparison?.comparison[1] ?? ""];

  const handleButtonClick = () => {
    if (isSorting && !!selectedCandidate) {
      const didSelectA = selectedCandidate === pdfA?.id;

      rootStore.provideComparatorResult(didSelectA);
    } else {
      rootStore
        .sortCandidates()
        .then((res) => rootStore.setFinalSortResult(res));
      setIsSorting(true);
    }
  };

  return (
    <>
      <div>
        <Header title="Sort Candidates"></Header>

        <SortWrapper>
          <CandidateCard
            data={pdfA}
            isSelected={!!selectedCandidate && selectedCandidate === pdfA?.id}
            onClick={() => setSelectedCandidate(pdfA?.id ?? null)}
          />
          <Button
            disabled={isSorting && !comparison}
            onClick={() => handleButtonClick()}
          >
            {isSorting ? "Next" : "Start"}
          </Button>
          <CandidateCard
            data={pdfB}
            isSelected={!!selectedCandidate && selectedCandidate === pdfB?.id}
            onClick={() => setSelectedCandidate(pdfB?.id ?? null)}
          />
        </SortWrapper>
      </div>
    </>
  );
});
