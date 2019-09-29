import React, { Component } from "react";

import { Grid, Typography, Button } from "@material-ui/core";
import Card from "./Card";

class Game extends Component {
  constructor() {
    super();
    this.twitch = window.Twitch ? window.Twitch.ext : null;

    this.state = {
      pot: 0
    };
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.listen("broadcast", (target, contentType, message) => {
        console.log(message);
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten("broadcast", () =>
        console.log("successfully unlistened")
      );
    }
  }

  render() {
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
              Pot: {this.state.pot} {this.state.pot !== 1 ? "bits" : "bit"}
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
  }
}

export default Game;
