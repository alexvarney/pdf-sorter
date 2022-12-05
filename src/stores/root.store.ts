import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export class RootStore {
  _testField = "";

  constructor() {
    makeAutoObservable(this);
  }

  get testField() {
    return this._testField;
  }

  setTestField(value: string) {
    this._testField = value;
  }
}

export const rootStore: RootStore = new RootStore();

const RootStoreContext = createContext<RootStore>(rootStore);
export const RootStoreProvider = RootStoreContext.Provider;

export const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);

  return store;
};
