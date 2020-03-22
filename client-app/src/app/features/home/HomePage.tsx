import React from "react";
import { Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

export  const HomePage = () => {
  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>Home page</h1>
      <h2>go to <Link to="/activities">activities</Link></h2>
    </Container>
  );
};
export default HomePage;