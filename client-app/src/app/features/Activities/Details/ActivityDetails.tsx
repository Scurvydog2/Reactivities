import React, { useContext, useEffect } from "react";
import {  Grid, GridColumn } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../stores/activityStore";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../layout/LoadingComponent";
import { ActivityDetailedHeader } from "../Details/ActivityDetailedHeader";
import { ActivityDetailedInfo } from "../Details/ActivityDetailedInfo";
import { ActivityDetailedChat } from "../Details/ActivityDetailedChat";
import { ActivityDetailedSidebar } from "../Details/ActivityDetailedSidebar";
interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity: activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [activityStore, loadActivity, match.params.id]);

  if (loadingInitial ){
    return <LoadingComponent content="Loading Activity ..."></LoadingComponent>;
  }


if(!activity)
{
  return <h1>activity not found</h1>
}



  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat />
      </GridColumn>
      <GridColumn width={6}>
        <ActivityDetailedSidebar />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDetails);
