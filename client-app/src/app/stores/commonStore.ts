import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = null;
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  setError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    if (token) {
      // Never store tokens in local storage in a production app
      localStorage.setItem("jwt", token); 
    }

    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}