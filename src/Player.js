import React from "react";
import { motion } from "framer-motion";

const Player = ({ pos, playerNum, gameState }) => {
  // Define animation variants for special states
  const variants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    falling: {
      scale: 0,
      rotate: 360,
    },
  };

  return (
    <motion.div
      className={`player player-${playerNum}`}
      style={{
        // CSS Grid is 1-indexed
        gridRowStart: pos.r + 1,
        gridColumnStart: pos.c + 1,
      }}
      layout // Animates position changes
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      // Animate based on gameState
      variants={variants}
      animate={gameState === "HANDLING_TILE" ? "falling" : "idle"}
    />
  );
};

export default Player;
