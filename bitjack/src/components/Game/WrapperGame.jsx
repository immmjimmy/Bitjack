import React from "react";
import Game from "./Game";
import Leaderboard from "./Leaderboard";

const WrapperGame = () => {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <Game />
      <Leaderboard />
    </div>
  )
};

export default WrapperGame;
