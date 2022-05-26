//Buttons
const startButton = document.querySelector("button#start");
const pauseButton = document.querySelector("button#pause");
const playAgain = document.querySelector("#play-again");
const tryAgain = document.querySelector("#try-again");
const audioButton = document.querySelector("#mute");
const playButton = document.querySelector("#play");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const time30sButton = document.querySelector("#time30s");
const time60sButton = document.querySelector("#time60s");
const time90sButton = document.querySelector("#time90s");

//Display
const scoreCounter = document.querySelector("#score");
const minDecElement = document.getElementById("minDec");
const minUniElement = document.getElementById("minUni");
const secDecElement = document.getElementById("secDec");
const secUniElement = document.getElementById("secUni");
const startScreen = document.querySelector("#start-screen");
const victoryScreen = document.querySelector("#victory-screen");
const defeatScreen = document.querySelector("#defeat-screen");
const title = document.querySelector("#title");
const credit = document.querySelector("#credit");

//Audio
const backgroundMusic = document.querySelector("#background-music");
backgroundMusic.volume = 0.1;
const victoryFanfare = document.querySelector("#victory-fanfare");
victoryFanfare.volume = 0.25;
const defeatFanfare = document.querySelector("#defeat-fanfare");
defeatFanfare.volume = 0.25;
const buttonClick = document.querySelector("#button-click");
const playSfx = document.querySelector("#play-sfx");
playSfx.volume = 0.5;

//Instancing
const board = new GameBoard(9, 5);
const player = new Player();
const game = new Game();
const timer = new Timer();
timer.printTime();
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

playButton.addEventListener("click", () => {
  title.classList.add("fly");
  credit.classList.add("fly");
  setTimeout(() => {
    title.style.visibility = "hidden";
    credit.style.visibility = "hidden";
  }, 490);
  setTimeout(() => {
    startScreen.style.display = "none";
  }, 2000);
  playSfx.play();
  playSfx.currentTime = 0;
});

easyButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.difficultySetting = "easy";
    easyButton.classList.add("set-pushed");
    mediumButton.classList.remove("set-pushed");
    hardButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
});

mediumButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.difficultySetting = "medium";
    mediumButton.classList.add("set-pushed");
    easyButton.classList.remove("set-pushed");
    hardButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
});

hardButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.difficultySetting = "hard";
    hardButton.classList.add("set-pushed");
    mediumButton.classList.remove("set-pushed");
    easyButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
});

time30sButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.timeLimit = 30;
    timer.timeRemaining = 30;
    timer.printTime();
    time30sButton.classList.add("set-pushed");
    time60sButton.classList.remove("set-pushed");
    time90sButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
});

time60sButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.timeLimit = 60;
    timer.timeRemaining = 60;
    timer.printTime();
    time60sButton.classList.add("set-pushed");
    time30sButton.classList.remove("set-pushed");
    time90sButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
});

time90sButton.addEventListener("click", () => {
  if (!game.isStarted) {
    game.timeLimit = 90;
    timer.timeRemaining = 90;
    timer.printTime();
    time90sButton.classList.add("set-pushed");
    time60sButton.classList.remove("set-pushed");
    time30sButton.classList.remove("set-pushed");
    buttonClick.play();
    buttonClick.currentTime = 0;
  }
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
    case "KeyP":
      game.pause();
      buttonClick.play();
      buttonClick.currentTime = 0;
      break;
    default:
      return;
  }
});
