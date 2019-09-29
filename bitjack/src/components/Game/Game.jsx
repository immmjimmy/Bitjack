import React, { Component } from "react";
import axios from "axios";

import { Grid, Typography } from "@material-ui/core";
import Card from "./Card";

class Game extends Component {
  constructor() {
    super();

    this.state = {
      pot: 0,
      streamerHand: [],
      viewerHand: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8081/initialize/gamesdonequick")
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get("http://localhost:8081/getStreamHand/gamesdonequick")
      .then(res => {
        this.setState({
          streamerHand: res.data[0].streamHand
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {

    const cards = this.state.streamerHand.map(x => {
      return <Card number={x} key={x} />
    });
    
    console.log(cards);

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
          {cards}
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
        ></Grid>
      </Grid>
    );
  }
}

export default Game;
