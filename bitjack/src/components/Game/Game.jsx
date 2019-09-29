import React, { useState } from "react";

import { Grid, Typography, Button } from "@material-ui/core";
import Card from "./Card";

const Game = props => {
  const [pot, setPot] = useState(0);

  return (
    <Grid
      container
      direction="column"
      style={{ height: "100%", maxHeight: "100%" }}
    >
      <Grid
        item
        xs
        style={{ maxWidth: "100%" }}
        container
        alignItems="center"
        justify="center"
      >
        <Card value="10" suit="hearts" flip="0" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="0" />
        <Card value="5" suit="hearts" flip="1" />
      </Grid>
      <Grid
        item
        xs={2}
        style={{ maxWidth: "100%" }}
        container
        alignItems="center"
        justify="center"
      >
        <Grid item xs>
          <Typography
            variant="h2"
            style={{
              height: "100%",
              textAlign: "center",
              textJustify: "center",
              fontWeight: "500"
            }}
          >
            Pot: {pot} {pot !== 1 ? "bits" : "bit"}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography
            variant="h2"
            style={{
              height: "100%",
              textAlign: "center",
              textJustify: "center",
              fontWeight: "500"
            }}
          >
            Scroll for leaderboard
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs
        style={{ overflowX: "auto", maxWidth: "100%" }}
        container
        alignItems="center"
        justify="center"
      >
        <Card value="10" suit="hearts" flip="0" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="1" />
        <Card value="5" suit="hearts" flip="0" />
        <Card value="5" suit="hearts" flip="1" />
      </Grid>
    </Grid>
  );
};

export default Game;
