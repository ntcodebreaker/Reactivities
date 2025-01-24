import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem('jwt');
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
    
    // reacts to token change storing or removing 
    // from local storage
    reaction(
      () => this.token,
      token => {
        if (token) {
          // Never store tokens in local storage in a production app
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }
      }
    )
  }

  setError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}