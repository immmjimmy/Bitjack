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
  const determineNumber = number => {
    let divided = number % 13 + "";

    switch (divided) {
      case "0":
        divided = "A";
        break;
      case "10":
        divided = "J";
        break;
      case "11":
        divided = "Q";
        break;
      case "12":
        divided = "K";
        break;
      default:
        break;
    }

    return divided;
  };

  const determineSuit = number => {
    const modded = number / 13 ;
    switch(modded) {
      case 0:
        return "♠";
      case 1:
        return "♣";
      case 2:
        return "♦";
      default:
        return "♥";
    }
  }

  const { number, classes, key } = props;
  // The back of the card should be the default state
  const defaultFlip = false;

  const [flipped, setFlipped] = useState(defaultFlip);

  const value = determineNumber(number);
  const suit = determineSuit(number);

  return (
    <ReactCardFlip
      isFlipped={false}
      flipDirection="horizontal"
      containerStyle={{ width: "100px", height: "150px", padding: "0px 4px" }}
      key={key}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        key="front"
        className={classes.front}
      >
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
              {`${value} ${suit}`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <div className={classes.back} key="back" />
    </ReactCardFlip>
  );
};

export default withStyles(styles)(Card);
