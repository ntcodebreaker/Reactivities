import { User } from "./user";

export interface Profile {
  userName: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount: number; // count of people following this profile
  followingCount: number; // count of people this profile follows
  following: boolean; // is the current user following this profile
  photos?: Photo[];
}

export class Profile implements Profile {
  userName: string;
  displayName: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
  
  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}