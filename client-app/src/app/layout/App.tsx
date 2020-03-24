import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../features/Nav/NavBar";
import ActivityDashboard from "../features/Activities/Dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from "react-router-dom";
import HomePage from "../features/home/HomePage";
import { ActivityForm } from "../features/Activities/Form/ActivityForm";
import ActivityDetails from "../features/Activities/Details/ActivityDetails";
import {ToastContainer} from 'react-toastify';
import NotFound from "../layout/NotFound";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <ToastContainer position='bottom-right'/>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  exact
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
