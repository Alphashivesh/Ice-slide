# 🧊 Ice Slide Duel 🏁

Ice Slide Duel is a fast-paced, 2-player competitive puzzle game. Players control characters on a slippery ice grid, sliding from one point to another. Use your wits to navigate around walls, avoid traps, and use portals to your advantage. The first player to slide onto the target wins!

Built with React and `framer-motion` for a smooth, professional, and animated feel.

---

# [Live Demo 🚀](https://ice-slide-drab.vercel.app/)

## 🎮 How to Play

The game is turn-based, with the current player highlighted at the top of the screen.

### The Goal
Be the **first player** to land on the **Target (🏁)**.

### Controls
Both players use the **Arrow Keys (↑, ↓, ←, →)** on their turn.

### The Sliding Mechanic
This isn't a normal game! When you press a direction, your character **slides** and will not stop until they hit something. You must plan your moves carefully.

### Grid Tiles
* **Ice (White):** The normal floor. You slide right over it.
* **Wall (Grey):** Your player will stop *before* hitting the wall.
* **Hole (Black):** You fall in! Your turn ends, and you are sent back to your starting position.
* **Portal (Purple):** You are instantly teleported to the other portal, and your turn ends.
* **Target (🏁):** Land on this tile to win the game!

## ✨ Features

* **2-Player Turn-Based Logic:** Play against a friend on the same keyboard.
* **Slippery Physics:** Unique sliding mechanic that requires forethought and puzzle-solving.
* **Smooth Animations:** Built with `framer-motion` for satisfying slides, falls, and teleports.
* **Special Tiles:** Walls, traps, and portals make the level dynamic and challenging.
* **Winner Overlay:** A clean end-screen declares the winner and allows for a quick reset.

## 💻 Tech Stack

* **[React](https://reactjs.org/)**: Used for all game logic, state management, and UI.
* **[framer-motion](https://www.framer.com/motion/)**: Powers all the player animations and screen transitions.
* **CSS**: A modern, "icy" theme styled from scratch.

## 🚀 How to Run

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/alphashivesh/ice-slide-duel.git](https://github.com/alphashivesh/ice-slide-duel.git)
    cd ice-slide-duel
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(You may also need to add `@babel/runtime` if it's not in the `package.json`)*
    ```bash
    npm install @babel/runtime
    ```
3.  **Run the application:**
    ```bash
    npm start
    ```
    The app will open automatically in your browser at `http://localhost:3000`.
