//Buttons
const startButton = document.querySelector("button#start");
const pauseButton = document.querySelector("button#pause");
const playAgain = document.querySelector("#play-again");
const tryAgain = document.querySelector("#try-again");
const audioButton = document.querySelector("#mute");
const playButton = document.querySelector("#play");

//Display
const scoreCounter = document.querySelector("#score");
const minDecElement = document.getElementById("minDec");
const minUniElement = document.getElementById("minUni");
const secDecElement = document.getElementById("secDec");
const secUniElement = document.getElementById("secUni");
const startScreen = document.querySelector("#start-screen");
const victoryScreen = document.querySelector("#victory-screen");
const defeatScreen = document.querySelector("#defeat-screen");

//Audio
const backgroundMusic = document.querySelector("#background-music");
backgroundMusic.volume = 0.25;
const victoryFanfare = document.querySelector("#victory-fanfare");
const defeatFanfare = document.querySelector("#defeat-fanfare");
const buttonClick = document.querySelector("#button-click");

//Instancing
const board = new GameBoard(9, 5);
const player = new Player();
const game = new Game();
const timer = new Timer();
const moleHoles = [];
player.getStartingCell();
player.show();

//Event listeners
startButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.start();
  } else {
    game.reset();
  }
  buttonClick.play();
  buttonClick.currentTime = 0;
});

pauseButton.addEventListener("click", () => {
  game.pause();
  buttonClick.play();
  buttonClick.currentTime = 0;
});

playAgain.addEventListener("click", () => {
  if (game.isFinished) {
    victoryScreen.style.display = "none";
    victoryFanfare.pause();
    victoryFanfare.currentTime = 0;
  }
  buttonClick.play();
  buttonClick.currentTime = 0;
});

tryAgain.addEventListener("click", () => {
  if (game.isFinished) {
    defeatScreen.style.display = "none";
    defeatFanfare.pause();
    defeatFanfare.currentTime = 0;
  }
  buttonClick.play();
  buttonClick.currentTime = 0;
});

audioButton.addEventListener("click", () => {
  if (game.soundIsActive) {
    game.soundIsActive = false;
    audioButton.classList.remove("audio");
    audioButton.classList.add("muted");
    if (game.isStarted) {
      backgroundMusic.pause();
    }
  } else {
    game.soundIsActive = true;
    audioButton.classList.remove("muted");
    audioButton.classList.add("audio");
    if (game.isStarted) {
      backgroundMusic.play();
    }
  }
  buttonClick.play();
  buttonClick.currentTime = 0;
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

playButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  buttonClick.play();
  buttonClick.currentTime = 0;
});
