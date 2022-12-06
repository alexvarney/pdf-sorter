import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { Routes } from "./utils/types";
import { useRootStore } from "./utils/use-root-store";
import { ResultsView, SortView, UploadView } from "./views";

const HeaderContainer = styled.div`
  display: flex;
  gap: 1rem;

  background-color: var(--black);
  padding: 0.5rem;

  & > button {
    background: var(--white);
    border: none;
    padding: 0.25rem;
  }
`;

const Layout = styled.div`
  padding: 64px 128px;
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
      <HeaderContainer>
        <button onClick={() => store.setRoute(Routes.UPLOAD)}>Upload</button>
        <button onClick={() => store.setRoute(Routes.SORT)}>Sort</button>
        <button onClick={() => store.setRoute(Routes.RESULTS)}>Results</button>
      </HeaderContainer>
      <Layout>
        <ViewComponent />
      </Layout>
    </div>
  );
});

export default App;
