import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export enum Routes {
  UPLOAD,
  SORT,
  RESULTS,
}

export class RootStore {
  _route = Routes.UPLOAD;

  constructor() {
    makeAutoObservable(this);
  }

  get route(): Routes {
    return this._route;
  }

  setRoute(value: Routes) {
    this._route = value;
  }
}

export const rootStore: RootStore = new RootStore();

(window as any).rootStore = rootStore;

const RootStoreContext = createContext<RootStore>(rootStore);
export const RootStoreProvider = RootStoreContext.Provider;

export const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);

  return store;
};
