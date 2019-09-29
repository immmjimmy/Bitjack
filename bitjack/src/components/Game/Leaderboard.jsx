import React, { Component } from "react";
import axios from "axios";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography
} from "@material-ui/core";

class Leaderboard extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    axios
      .get("http://localhost:8081/getLeaderboard/gamesdonequick")
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

    setInterval(() => {
      axios
        .get("http://localhost:8081/getLeaderboard/gamesdonequick")
        .then(res => {
          //console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }, 10000);
  }

  render() {
    return (
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h2">Rank</Typography>
            </TableCell>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h2">Twitch Handle</Typography>
            </TableCell>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h2">Score</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h3">1</Typography>
            </TableCell>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h3">ArtisticCrow</Typography>
            </TableCell>
            <TableCell align="center" style={{ width: "120px" }}>
              <Typography variant="h3">100000</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default Leaderboard;
