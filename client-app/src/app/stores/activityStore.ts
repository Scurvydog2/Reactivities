import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/Agent";
import { ADDRGETNETWORKPARAMS } from "dns";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null =null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }
  groupActivitiesByDate(activities: IActivity[]){
    const sortedActivities =activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )
    return Object.entries(sortedActivities.reduce((activities,activity) =>
    {
      const date=activity.date.toISOString().split('T')[0];
      activities[date]=activities[date] ?[...activities[date],activity] :[activity]
      return activities;
    },{} as {[key:string]:IActivity[]}));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
        console.log(error);
      });
    }
  };
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
    }
  
  @action loadActivity = async (id: string) => {
     let activity =this.getActivity(id);

    if (activity) {
      this.activity=activity;
    }else{
      this.loadingInitial=true;
      try {
        activity=await agent.Activities.details(id);
        runInAction('getting activity',()=>{
          activity.date=new Date(activity.date);
          this.activity=activity;
          this.loadingInitial=false;
        })
      } catch (error) {
        console.log(error);
        runInAction('get activity error',()=>{
          this.loadingInitial=false
        })

      }
  };
}
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("create activity error", () => {
        this.submitting = false;
      });
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;

      });
    } catch (error) {
      console.log(error);
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
    } finally {
    }
  };
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    try {
      this.target = event.currentTarget.name;
      await agent.Activities.delete(id);
      runInAction("Delete Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      console.log(error);
      runInAction("Delete Activity error", () => {
        this.submitting = false;
        this.target = "";
      });
    } finally {
    }
  };
  @action clearActivity=()=>{
    this.activity=null;
  }
}

export default createContext(new ActivityStore());
