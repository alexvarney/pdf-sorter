import { createContext, useContext } from "react";
import { RootStore, rootStore } from "../stores/root.store";

const RootStoreContext = createContext<RootStore>(rootStore);
export const RootStoreProvider = RootStoreContext.Provider;

export const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);

  return store;
};
