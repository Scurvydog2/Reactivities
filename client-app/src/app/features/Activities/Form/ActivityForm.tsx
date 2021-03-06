import React, { useState, useContext, useEffect } from "react";
import { Button, Segment, Form, Grid, GridColumn } from "semantic-ui-react";
import {
  IActivityFormValues,
  ActivityFormValues,
} from "../../../models/activity";
import TextInput from "../../../common/Form/TextInput";
import SelectInput from "../../../common/Form/SelectInput";
import TextAreaInput from "../../../common/Form/TextAreaInput";
import DateInput from "../../../common/Form/DateInput";
import { category } from "../../../common/Options/categoryOptions";
import ActivityStore from "../../../stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { combineDateAndTime } from "../../../common/util/util";
import { v4 as uuid } from "uuid";
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from "revalidate";

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "The category is required" }),
  description: composeValidators(
    isRequired("Description"),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 4 characters",
    })
  )(),
  city: isRequired("City"),
  venue: isRequired("Venue"),
  date: isRequired("Date"),
  time: isRequired("Time"),
});

interface DetailParams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  location,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    submitting,
    loadActivity,
    clearActivity,
    activity: initialFormState,
    createActivity,
    editActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  component={TextAreaInput}
                  rows={3}
                  name="description"
                  placeholder="Description"
                  value={activity.description}
                />
                <Field
                  name="category"
                  options={category}
                  component={SelectInput}
                  placeholder="Category"
                  value={activity.category}
                />
                <Form.Group widths="equal">
                  <Field
                    component={DateInput}
                    name="date"
                    date={true}
                    placeholder="Date"
                    value={activity.date}
                  />
                  <Field
                    component={DateInput}
                    name="time"
                    time={true}
                    placeholder="Time"
                    value={activity.time}
                  />
                </Form.Group>

                <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={activity.city}
                />
                <Field
                  name="venue"
                  component={TextInput}
                  placeholder="Venue"
                  value={activity.venue}
                />
                <Button
                  floated="right"
                  disabled={loading || invalid || pristine}
                  positive
                  type="submit"
                  content="Submit"
                  loading={submitting}
                />
                <Button
                  floated="right"
                  disabled={loading}
                  type="button"
                  content="Cancel"
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </GridColumn>
    </Grid>
  );
};
export default observer(ActivityForm);
