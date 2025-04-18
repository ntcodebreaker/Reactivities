import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns"
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) =>
      a.date!.getTime() - b.date!.getTime());
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );

  }

  loadActivities = async () => {
    this.setLoadingInitial(true);

    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach(activity => {
          this.setActivity(activity);
        });

        this.setLoadingInitial(false);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { this.setLoadingInitial(false) });
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => this.selectedActivity = activity);
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;

    /**
     *  complete the fields in the activity model 
     *  from the values gathered in the form
     */
    if (user) {
      activity.isGoing = activity.attendees!.some(
        a => a.userName === user.userName
      );

      activity.isHost = activity.hostUserName === user.userName;

      activity.host = activity.attendees?.find(
        a => a.userName === activity.hostUserName
      );
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    activity.id = uuid();

    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);

      /**
       * complete the fields in the activity model 
       * from the values gathered in the form
       * */
      newActivity.hostUserName = user!.userName;
      newActivity.attendees = [attendee];

      this.setActivity(newActivity);

      runInAction(() => {
        this.selectedActivity = newActivity;
      });

    } catch (error) {
      console.log(error);
    }
  }

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);

      runInAction(() => {
        if (activity.id) {
          const updatedActivity = { ...this.getActivity(activity.id), ...activity };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { this.loading = false; });
    }
  }

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName);
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading = false);
    }
  }

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } catch (error) {
      console.error(error)
    } finally {
      runInAction(() => this.loading = false);
    }
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  /**
   * toggle between follow and unfollow a given profile
   * and synchronize in every attendee across all activities 
   * (attendee is also a profile)
   */
  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if (attendee.userName === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      })
    })
  }
}