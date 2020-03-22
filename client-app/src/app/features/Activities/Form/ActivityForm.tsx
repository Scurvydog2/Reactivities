import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Button, Segment, Form } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";

import { v4 as uuid } from "uuid";
import ActivityStore from "../../../stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  location,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity,
    activity: initialFormState
  } = activityStore;
 

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
  });
  useEffect(() => {
    if (activity.id.length===0 && match.params.id) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
     clearActivity();
    }
    
  }, [loadActivity,clearActivity,match.params.id,initialFormState,activity.id.length]);
  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(()=>history.push(`/activities/${activity.id}`));
    }
  };
  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          onChange={handleInputChange}
          name="description"
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          name="category"
          onChange={handleInputChange}
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          type="datetime-local"
          onChange={handleInputChange}
          name="date"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          name="city"
          onChange={handleInputChange}
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          name="venue"
          onChange={handleInputChange}
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          onChange={handleInputChange}
          positive
          type="submit"
          content="Submit"
          loading={submitting}
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => history.push('/activities')}
        />
      </Form>
    </Segment>
  );
};
export default observer(ActivityForm);
