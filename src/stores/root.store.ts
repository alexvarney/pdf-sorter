import { makeAutoObservable } from "mobx";
import { Routes } from "../utils/types";

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
