const board = new GameBoard(9, 5);
const player = new Player();
const game = new Game();
const timer = new Timer();
let moleHoles = [];
player.getStartingCell();
player.show();
const startButton = document.querySelector("button#start");
const pauseButton = document.querySelector("button#pause");
const resetButton = document.querySelector("button#reset");
const scoreCounter = document.querySelector("#score");
const minDecElement = document.getElementById("minDec");
const minUniElement = document.getElementById("minUni");
const secDecElement = document.getElementById("secDec");
const secUniElement = document.getElementById("secUni");

startButton.addEventListener("click", () => {
  game.start();
});

pauseButton.addEventListener("click", () => {
  game.pause();
});

resetButton.addEventListener("click", () => {
  game.reset();
});

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  switch (event.code) {
    case "KeyW":
      player.move("up");
      break;
    case "KeyS":
      player.move("down");
      break;
    case "KeyA":
      player.move("left");
      break;
    case "KeyD":
      player.move("right");
      break;
    case "Enter":
      player.swingBat();
      break;
    default:
      return;
  }
});
