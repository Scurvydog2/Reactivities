import React from "react";
import {
  Item,
  Button,
  Segment,
  SegmentGroup,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity } from "../../../models/activity";

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity
}) => {
 
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/asses/user.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted by BOB</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {activity.date}
        <Icon name="marker" />
        {activity.venue},{activity.city}
      </Segment>
      <Segment secondary>attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </SegmentGroup>
  );
};
export default ActivityListItem;