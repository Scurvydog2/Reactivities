import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../stores/activityStore";
import { RouteComponentProps, NavLink } from "react-router-dom";
import LoadingComponent from "../../../layout/LoadingComponent";
interface DetailParams{
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>>= ({
match,
history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity: activity,
    loadActivity,
    loadingInitial
  } = activityStore;
  
  useEffect(() => {
    loadActivity(match.params.id);
  },[activityStore,loadActivity,match.params.id])
  if (loadingInitial|| !activity) return<LoadingComponent content="Loading Activity ..."></LoadingComponent>


  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as ={NavLink} to= {`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => history.push(`/activities`)}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
