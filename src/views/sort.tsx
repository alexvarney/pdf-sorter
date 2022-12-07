import { observer } from "mobx-react-lite";
import { Header } from "../components/header";

export const SortView = observer(() => {
  return (
    <>
      <div>
        <Header title="Sort Candidates"></Header>
      </div>
    </>
  );
});
