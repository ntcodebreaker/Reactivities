import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  loading = false;
  uploading = false;
  followings: Profile[] = [];
  loadingFollowins = false;
  userActivities: UserActivity[] = [];
  loadingActivities = false;
  activeTab = 0;

  constructor() {
    makeAutoObservable(this);
    reaction(
      // data function. When this piece of data changes...
      () => this.activeTab,

      // ... do this (effect function)
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;
  }

  /**
   * if we are at the profile of the current logged in user
   * we can perform several tasks like uploading photos.
   */
  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.userName === this.profile.userName;
    }

    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);

      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      })

    } catch (error) {
      console.error(error);
      runInAction(() => this.loadingProfile = false);
    }
  }

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }

        this.uploading = false;
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.uploading = false);
    }
  }

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.loading = false;
        }
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.loading = false);
    }
  }

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
          this.loading = false;
        }
      })

    } catch (error) {
      console.error(error);
      runInAction(() => this.loading = false);
    }
  }

  updateProfile = async (profile: Partial<Profile>) => {
    this.loading = true;
    try {
      await agent.Profiles.update(profile);
      runInAction(() => {
        if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
          store.userStore.setDisplayName(profile.displayName);
        }

        this.profile = { ...this.profile, ...profile as Profile };
        this.loading = false;
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.loading = false);
    }
  }

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;
    try {
      await agent.Profiles.updateFollowing(username);

      store.activityStore.updateAttendeeFollowing(username);

      runInAction(() => {
        // the current user is looking at someone else's profile
        if (this.profile && this.profile.userName !== store.userStore.user?.userName && this.profile.userName === username) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        // TODO: does this really make sense?
        if (this.profile && this.profile.userName === store.userStore.user?.userName) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
        }

        // reflect the count in the list of followers/following
        this.followings.forEach(profile => {
          if (profile.userName == username) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });

        this.loading = false;
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.loading = false);
    }
  }

  loadFollowings = async (predicate: string) => {
    this.loadingFollowins = true;
    try {
      const followings = await agent.Profiles.listFollowing(this.profile!.userName, predicate);
      runInAction(() => {
        this.followings = followings;
        this.loadingFollowins = false;
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.loadingFollowins = false);
    }
  }

  loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const activities = await agent.Profiles.listActivities(username, predicate!);

      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      })
    } catch (error) {
      console.error(error);
      runInAction(() => this.loadingActivities = false);
    }
  }
}