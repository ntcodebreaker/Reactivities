import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      /**
       * create a SignalR connection specifying the endpoint 
       * where the hub is hosted at the server. Include bearer token 
       * in the query string.
       */
      this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
      
      this.hubConnection.start()
        .catch(error => console.log("Error establishing the connection: ", error));
      
      /**
       * handler that hears for the "loadComments" event fired at the server hub
       * in this case the event provides a list of activity-related comments.
       */
      this.hubConnection.on("loadComments", (comments: ChatComment[]) => {
        runInAction(() => {
          comments.forEach(comment => {
            comment.createdAt = new Date(comment.createdAt + 'Z'); // UTC
          })
          this.comments = comments
        });
      });

      /**
       * handler that hears for the "receiveComment" event fired at the server 
       * hub in this case the event provides the last added comment from 
       * any connected client.
       */
      this.hubConnection.on("receiveComment", (comment: ChatComment) => { 
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);
          this.comments.unshift(comment)
        });
      });
    }
  }

  stopHubConnection = () => {
    this.hubConnection?.stop()
      .catch(error => console.log("Error stopping connection: ", error));
  }

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  }

  /**
   * send every new comment to the SignalR hub at the server
   */
  addComment = async (values: any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke("SendComment", values);
    } catch (error) {
      console.error(error);
    }
  }
}