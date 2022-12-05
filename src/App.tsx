import { observer } from "mobx-react-lite";
import { useRootStore } from "./stores/root.store";

const App = observer(() => {
  const store = useRootStore();

  return (
    <div className="App">
      <input
        value={store.testField}
        onChange={(e) => store.setTestField(e.target.value)}
      ></input>
    </div>
  );
});

export default App;
