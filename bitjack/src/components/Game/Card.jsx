import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import ReactCardFlip from "react-card-flip";

const styles = {
  card: {
    width: "100px",
    height: "150px"
  },
  front: {
    background: "linear-gradient(-180deg, #6441A5, #b9A3E3)",
    color: "white"
  },
  back: {
    background: "linear-gradient(-180deg, #6441A5, #b9A3E3)",
    width: "100px",
    height: "150px"
  }
};

const Card = props => {
  const { value, suit, flip, classes } = props;
  // The back of the card should be the default state
  const defaultFlip = flip !== "0" ? true : false;

  const [flipped, setFlipped] = useState(defaultFlip);

  return (
    <ReactCardFlip
      isFlipped={flipped}
      flipDirection="horizontal"
      containerStyle={{ width: "100px", height: "150px", padding: "0px 4px" }}
    >
      <Grid container justify="center" alignItems="center" key="front" className={classes.front}>
        <Grid item container alignItems="center" xs className={classes.card}>
          <Grid item xs>
            <Typography
              variant="h4"
              style={{
                height: "100%",
                textAlign: "center",
                textJustify: "center"
              }}
            >
              {`${value}`} &clubs;
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <div className={classes.back} key="back" />
    </ReactCardFlip>
  );
};

export default withStyles(styles)(Card);
