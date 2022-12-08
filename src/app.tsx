import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { rootStore } from "./stores/root.store";
import { Routes } from "./utils/types";
import { useRootStore } from "./utils/use-root-store";
import { ResultsView, SortView, UploadView } from "./views";

const Layout = styled.div<{ constrain: boolean }>`
  padding: 4rem;

  @media (min-width: 768px) {
    padding: 4rem 8rem;
  }

  height: ${(props) => (props.constrain ? "100vh" : "auto")};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StateMap: Record<Routes, React.ElementType> = {
  [Routes.RESULTS]: ResultsView,
  [Routes.SORT]: SortView,
  [Routes.UPLOAD]: UploadView,
};

const App = observer(() => {
  const store = useRootStore();

  const ViewComponent = StateMap[store.route];

  return (
    <div
      className="App"
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
    >
      <Layout constrain={rootStore.route !== Routes.UPLOAD}>
        <ViewComponent />
      </Layout>
    </div>
  );
});

export default App;
