import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cell from "./Cell";
import Player from "./Player";

// --- Game Configuration ---
// E = Empty (Ice), W = Wall, T = Target, H = Hole
// O1/O2 = Portal Pair, P1 = Player 1 Start, P2 = Player 2 Start
const level1 = [
  ["P1", "E", "E", "E", "W", "E", "E", "E", "E", "P2"],
  ["E", "W", "E", "O1", "E", "E", "E", "W", "E", "E"],
  ["E", "E", "E", "W", "E", "W", "E", "E", "W", "E"],
  ["E", "E", "W", "E", "E", "E", "W", "E", "H", "E"],
  ["W", "E", "E", "E", "T", "E", "E", "E", "E", "W"],
  ["W", "E", "E", "H", "E", "E", "E", "E", "E", "W"],
  ["E", "E", "E", "W", "E", "E", "W", "E", "E", "E"],
  ["E", "E", "W", "E", "E", "W", "E", "W", "E", "E"],
  ["E", "W", "E", "O2", "E", "E", "E", "E", "W", "E"],
  ["E", "E", "E", "E", "W", "E", "E", "E", "E", "E"],
];

const GRID_ROWS = level1.length;
const GRID_COLS = level1[0].length;

// --- Helper Functions ---
const findPosition = (grid, char) => {
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] === char) return { r, c };
    }
  }
  return { r: 0, c: 0 };
};

const findPortals = (grid) => {
  const portal1 = findPosition(grid, "O1");
  const portal2 = findPosition(grid, "O2");
  return {
    [`${portal1.r}-${portal1.c}`]: portal2,
    [`${portal2.r}-${portal2.c}`]: portal1,
  };
};

// Helper to pause execution
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const initialP1Pos = findPosition(level1, "P1");
const initialP2Pos = findPosition(level1, "P2");
const portalMap = findPortals(level1);
const ANIMATION_TIME = 300; // ms for slide
const SPECIAL_ANIM_TIME = 400; // ms for hole/portal

// --- Game Component ---
function Game() {
  const [player1Pos, setPlayer1Pos] = useState(initialP1Pos);
  const [player2Pos, setPlayer2Pos] = useState(initialP2Pos);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  // Game State Machine: "IDLE", "SLIDING", "HANDLING_TILE"
  const [gameState, setGameState] = useState("IDLE");

  const resetGame = () => {
    setPlayer1Pos(initialP1Pos);
    setPlayer2Pos(initialP2Pos);
    setCurrentPlayer(1);
    setWinner(null);
    setGameState("IDLE");
  };

  const isWall = (r, c) => {
    if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS) return true;
    return level1[r][c] === "W";
  };

  const movePlayer = useCallback(
    async (key) => {
      // 1. Check if input is allowed
      if (gameState !== "IDLE" || winner) return;

      let dr = 0,
        dc = 0;
      if (key === "ArrowUp") dr = -1;
      else if (key === "ArrowDown") dr = 1;
      else if (key === "ArrowLeft") dc = -1;
      else if (key === "ArrowRight") dc = 1;
      else return; // Not an arrow key

      // 2. Lock the game
      setGameState("SLIDING");

      const playerPos = currentPlayer === 1 ? player1Pos : player2Pos;
      const setPlayerPos = currentPlayer === 1 ? setPlayer1Pos : setPlayer2Pos;
      const startPos = currentPlayer === 1 ? initialP1Pos : initialP2Pos;

      let currentPos = { ...playerPos };
      let nextPos = { r: playerPos.r + dr, c: playerPos.c + dc };
      let finalPos = { ...playerPos };

      // 3. Calculate final slide position
      while (true) {
        if (isWall(nextPos.r, nextPos.c)) {
          finalPos = { ...currentPos };
          break;
        }

        const tile = level1[nextPos.r][nextPos.c];
        // Stop ON special tiles
        if (tile === "T" || tile === "H" || tile.startsWith("O")) {
          finalPos = { ...nextPos };
          break;
        }

        currentPos = { ...nextPos };
        nextPos = { r: nextPos.r + dr, c: nextPos.c + dc };
      }

      // 4. Animate the slide
      setPlayerPos(finalPos);
      await wait(ANIMATION_TIME); // Wait for animation to finish

      // 5. Handle landing on the tile
      setGameState("HANDLING_TILE");
      const landedTile = level1[finalPos.r][finalPos.c];

      // 5a. Check for Win
      if (landedTile === "T") {
        setWinner(currentPlayer);
        setGameState("IDLE");
        return;
      }

      // 5b. Check for Hole
      if (landedTile === "H") {
        await wait(SPECIAL_ANIM_TIME); // Pause on hole
        setPlayerPos(startPos); // Reset position
        await wait(ANIMATION_TIME); // Wait for reset animation
      }

      // 5c. Check for Portal
      const portalTarget = portalMap[`${finalPos.r}-${finalPos.c}`];
      if (portalTarget) {
        await wait(SPECIAL_ANIM_TIME); // Pause on portal
        setPlayerPos(portalTarget); // Teleport
        await wait(ANIMATION_TIME); // Wait for teleport animation
      }

      // 6. Switch turn and unlock
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setGameState("IDLE");
    },
    [gameState, winner, currentPlayer, player1Pos, player2Pos]
  );

  // --- Keyboard Input Effect ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      movePlayer(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePlayer]);

  return (
    <div>
      <h2>Ice Slide</h2>
      <div className="status-bar">
        {!winner && (
          <motion.div
            key={currentPlayer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`turn-indicator turn-${currentPlayer}`}
          >
            Player {currentPlayer}'s Turn
          </motion.div>
        )}
      </div>

      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 50px)`,
        }}
      >
        {/* Render Grid Cells */}
        {level1.flat().map((tile, i) => (
          <Cell key={i} type={tile} />
        ))}

        {/* Render Players */}
        <Player pos={player1Pos} playerNum={1} gameState={gameState} />
        <Player pos={player2Pos} playerNum={2} gameState={gameState} />
      </div>

      {/* --- Winner Overlay --- */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="winner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`winner-text winner-${winner}`}>
              Player {winner} Wins!
            </div>
            <button className="reset-button" onClick={resetGame}>
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Game;
