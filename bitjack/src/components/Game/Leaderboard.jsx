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

    this.state = {
      leaderboard: [[]],
      initialized: false
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8081/getLeaderboard/gamesdonequick")
      .then(res => {
        console.log(res.data);
        this.setState({
          leaderboard: res.data[0].Leaderboard,
          initialized: true
        });
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
    const rows = !this.state.initialized
      ? undefined
      : this.state.leaderboard.map((element, i) => {
          return (
            <TableRow key={i}>
              <TableCell align="center" style={{ width: "120px" }}>
                <Typography variant="h3">{i + 1}</Typography>
              </TableCell>
              <TableCell align="center" style={{ width: "120px" }}>
                <Typography variant="h3">{element[0]}</Typography>
              </TableCell>
              <TableCell align="center" style={{ width: "120px" }}>
                <Typography variant="h3">{element[1]}</Typography>
              </TableCell>
            </TableRow>
          );
        });

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
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}

export default Leaderboard;
