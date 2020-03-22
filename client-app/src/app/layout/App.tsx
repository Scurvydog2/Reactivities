import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../features/Nav/NavBar";
import ActivityDashboard from "../features/Activities/Dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import HomePage from "../features/home/HomePage";
import { ActivityForm } from "../features/Activities/Form/ActivityForm";
import ActivityDetails from "../features/Activities/Details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {


  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route exact path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                exact
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
