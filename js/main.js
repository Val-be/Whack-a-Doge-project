class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.element = null;
    this.cells = this._createCells();
  }

  //Creates the cells of the game board
  _createCells() {
    this.element = document.querySelector(".grid");
    const cellArray = [];
    for (let i = 0; i < this.width * this.height; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cellArray.push(cell);
      this.element.appendChild(cell);
    }
    return cellArray;
  }
}

class Player {
  constructor() {
    this.className = "player-facing-right";
    this.cell = null;
    this.facedDirection = "right";
  }

  //Starting cell is the top left one
  getStartingCell() {
    this.cell = board.cells[0];
  }

  //Adds a class to the cell the player is in to show it
  //Display depends on the direction the player is facing
  show() {
    this.cell.classList.add(this.className);
    if (
      !this.cell.querySelector(".bat-facing-right") &&
      !this.cell.querySelector(".bat-facing-left")
    ) {
      switch (this.facedDirection) {
        case "right":
          const batRight = document.createElement("div");
          batRight.classList.add("bat-facing-right");
          this.cell.appendChild(batRight);
          break;
        case "left":
          const batLeft = document.createElement("div");
          batLeft.classList.add("bat-facing-left");
          this.cell.appendChild(batLeft);
          break;
      }
    }
  }

  //Opposite of the add() method
  hide() {
    switch (this.facedDirection) {
      case "right":
        const batRight = this.cell.querySelector(".bat-facing-right");
        this.cell.removeChild(batRight);
        break;
      case "left":
        const batLeft = this.cell.querySelector(".bat-facing-left");
        this.cell.removeChild(batLeft);
        break;
    }
    this.cell.classList.remove(this.className);
  }

  //Changes the direction the player is facing
  changeFacedDirection(direction) {
    switch (direction) {
      case "right":
        this.className = "player-facing-right";
        this.facedDirection = "right";
        break;
      case "left":
        this.className = "player-facing-left";
        this.facedDirection = "left";
    }
  }

  //Hides the player
  //Changes the index of the player on the grid
  //Show the player on its new position
  //Movement is conditionned by the canMove() method
  move(direction) {
    this.hide();
    let index = parseInt(this.cell.dataset.index);
    switch (direction) {
      case "up":
        if (this.canMove(direction)) {
          this.cell = board.cells[index - board.width];
        }
        break;
      case "down":
        if (this.canMove(direction)) {
          this.cell = board.cells[index + board.width];
        }
        break;
      case "left":
        if (this.canMove(direction)) {
          this.cell = board.cells[index - 1];
        }
        this.changeFacedDirection("left");
        break;
      case "right":
        if (this.canMove(direction)) {
          this.cell = board.cells[index + 1];
        }
        this.changeFacedDirection("right");
        break;
    }
    this.show();
  }

  //Checks if the player can move
  //Player cannot move on holes
  //Player cannot move out of grid border
  //Player cannot move if the game is paused or hasn't started
  canMove(direction) {
    if (!game.isPaused && game.isStarted) {
      let index = parseInt(this.cell.dataset.index);
      switch (direction) {
        case "up":
          if (index >= board.width) {
            if (board.cells[index - board.width]) {
              return (
                !board.cells[index - board.width].classList.contains(
                  "empty-hole"
                ) &&
                !board.cells[index - board.width].classList.contains(
                  "doge-hole"
                ) &&
                !board.cells[index - board.width].classList.contains(
                  "bonked-doge-hole"
                )
              );
            }
            return true;
          }
          return false;
        case "down":
          if (index < (board.height - 1) * board.width) {
            if (board.cells[index + board.width]) {
              return (
                !board.cells[index + board.width].classList.contains(
                  "empty-hole"
                ) &&
                !board.cells[index + board.width].classList.contains(
                  "doge-hole"
                ) &&
                !board.cells[index + board.width].classList.contains(
                  "bonked-doge-hole"
                )
              );
            }
            return true;
          }
          return false;
        case "left":
          if (!(index % board.width === 0)) {
            if (board.cells[index - 1]) {
              return (
                !board.cells[index - 1].classList.contains("empty-hole") &&
                !board.cells[index - 1].classList.contains("doge-hole") &&
                !board.cells[index - 1].classList.contains("bonked-doge-hole")
              );
            }
            return true;
          }
          return false;
        case "right":
          if (!(index % board.width === board.width - 1)) {
            if (board.cells[index + 1]) {
              return (
                !board.cells[index + 1].classList.contains("empty-hole") &&
                !board.cells[index + 1].classList.contains("doge-hole") &&
                !board.cells[index + 1].classList.contains("bonked-doge-hole")
              );
            }
            return true;
          }
          return false;
      }
    }
    return false;
  }

  //Launches a rotating animation on the bat using CSS classes
  //Calls the detectHit() method to know if a Doge has been hit
  swingBat() {
    if (!game.isPaused) {
      switch (this.facedDirection) {
        case "right":
          const batRight = this.cell.querySelector(".bat-facing-right");
          batRight.classList.toggle("swing-facing-right");
          setTimeout(() => {
            batRight.classList.toggle("swing-facing-right");
          }, 310);
          break;
        case "left":
          const batLeft = this.cell.querySelector(".bat-facing-left");
          batLeft.classList.toggle("swing-facing-left");
          setTimeout(() => {
            batLeft.classList.toggle("swing-facing-left");
          }, 310);
          break;
      }
      this.detectHit();
      if (game.soundIsActive) {
        whoosh.play();
        whoosh.currentTime = 0;
      }
    }
  }

  //Checks if the hole next to the player in the direction it's facing
  //contains a Doge. If it does, calls the getHit() method on it
  //Doesn't check if game is paused
  detectHit() {
    if (!game.isPaused) {
      let index = parseInt(this.cell.dataset.index);
      switch (this.facedDirection) {
        case "right":
          for (let i = 0; i < moleHoles.length; i++) {
            if (board.cells[index + 1] === moleHoles[i].cell) {
              moleHoles[i].getHit();
            }
          }
          break;
        case "left":
          for (let i = 0; i < moleHoles.length; i++) {
            if (board.cells[index - 1] === moleHoles[i].cell) {
              moleHoles[i].getHit();
            }
          }
          break;
      }
    }
  }
}

class MoleHole {
  constructor() {
    this.className = "empty-hole";
    this.cell = null;
    this.countainsMole = false;
    this.isGenerating = false;
    this.generator = null;
  }

  //Same as for player
  show() {
    this.cell.classList.add(this.className);
  }

  //Same
  hide() {
    this.cell.classList.remove(this.className);
  }

  //Creates a Doge in the hole it is called on with a CSS class
  //and increments the total number of Doges spawned
  //Only generates if the hole is empty and the game unpaused
  //Sets the countainsMole attribute to be true for future conditionnal blocks
  //Also plays a sound effect is game is not muted
  generateMole() {
    if (!this.countainsMole && !game.isPaused) {
      if (game.soundIsActive) {
        const pop = document.querySelector("#pop");
        pop.play();
        pop.currentTime = 0;
      }
      this.countainsMole = true;
      this.hide();
      this.className = "doge-hole";
      this.show();
      game.totalMoles++;
    }
  }

  //Opposite of precedent
  unpopMole() {
    if (!game.isPaused) {
      this.countainsMole = false;
      this.hide();
      this.className = "empty-hole";
      this.show();
    }
  }

  //Changes the display of the Doge in the hole to have a
  //caved-in head
  //Sets countainsMole to be false to avoid multiple hits connecting
  //consecutively
  //Increments score (displayed as bonks on screen) and print it
  //Also plays a sound effect
  getHit() {
    if (this.countainsMole && !game.isPaused) {
      if (game.soundIsActive) {
        const bonk = document.querySelector("#bonk");
        bonk.play();
        bonk.currentTime = 0;
      }
      this.countainsMole = false;
      this.hide();
      this.className = "bonked-doge-hole";
      this.show();
      game.score++;
      game.displayScore();
    }
  }

  //Sets an interval that has a 1/3 chance to spawn a Doge every
  //3 seconds
  //Every 5 seconds the hole is cleared regardless of state
  //Every second the display of the hole is updated
  startGenerating() {
    let time = 0;
    this.isGenerating = true;
    this.generator = setInterval(() => {
      time += 1;
      if (!game.isPaused) {
        if (time % 5 === 0) {
          this.unpopMole();
        }
        if (time % 3 === 0) {
          let rgn = Math.floor(Math.random() * 100);
          if (rgn <= 33) {
            this.generateMole();
          }
        }
        if (this.countainsMole) {
          this.hide();
          this.className = "doge-hole";
          this.show();
        }
        if (!this.countainsMole) {
          this.hide();
          this.className = "empty-hole";
          this.show();
        }
      }
    }, 1000);
  }

  //Clears the interval
  stopGenerating() {
    this.isGenerating = false;
    clearInterval(this.generator);
  }
}

class Timer {
  constructor() {
    this.interval = null;
    this.timeRemaining = parseInt(game.timeLimit);
  }

  //A standard countdown, nothing special
  startCountingDown() {
    let ticks = 0;
    this.interval = setInterval(() => {
      if (!game.isPaused && game.isStarted && !game.isFinished) {
        ticks++;
        if (ticks % 2 === 0) {
          this.timeRemaining--;
        }
        this.printTime();
        if (this.timeRemaining === 0) {
          clearInterval(this.interval);
          game.onFinish();
        }
      }
    }, 500);
  }

  getMinutes() {
    return Math.floor(this.timeRemaining / 60)
      .toString()
      .padStart(2, "0");
  }

  getSeconds() {
    return Math.floor(this.timeRemaining % 60)
      .toString()
      .padStart(2, "0");
  }

  printMinutes() {
    const minutes = this.getMinutes();
    minDecElement.textContent = minutes[0];
    minUniElement.textContent = minutes[1];
  }

  printSeconds() {
    const seconds = this.getSeconds();
    secDecElement.textContent = seconds[0];
    secUniElement.textContent = seconds[1];
  }

  printTime() {
    this.printMinutes();
    this.printSeconds();
  }

  reset() {
    clearInterval(this.interval);
    this.interval = null;
    this.timeRemaining = parseInt(game.timeLimit);
  }
}

class Game {
  constructor() {
    this.score = 0;

    this.totalMoles = 0;

    this.isStarted = false;

    this.isPaused = false;

    this.soundIsActive = true;

    this.isWon = null;

    this.isFinished = null;

    this.difficultySetting = "easy";

    this.timeLimit = 30;
  }

  //Distributes the holes and make them start generating
  //Starts the timer
  //Starts playing the background music
  start() {
    distributeHoles();
    this.isStarted = true;
    this.isFinished = false;
    this.isLost = false;
    this.isWon = false;
    delayedStart(moleHoles);
    timer.startCountingDown();
    startButton.textContent = "Reset";
    if (this.soundIsActive) {
      backgroundMusic.play();
    }
  }

  pause() {
    if (this.isStarted) {
      if (this.isPaused) {
        this.isPaused = false;
        pauseButton.textContent = "Pause";
        // backgroundMusic.play();
      } else {
        this.isPaused = true;
        pauseButton.textContent = "Resume";
        // backgroundMusic.pause();
      }
    }
  }

  displayScore() {
    scoreCounter.textContent = game.score.toString().padStart(2, "0");
  }

  stop() {}

  onFinish() {
    this.isFinished = true;
    let ratio = parseInt((this.score * 100) / this.totalMoles);
    if (ratio >= 70) {
      this.isWon = true;
    }
    if (this.isWon) {
      console.log("You won!");
      victoryScreen.style.display = "flex";
      if (game.soundIsActive) {
        victoryFanfare.play();
      }
      setTimeout(() => {
        victoryScreen.style.display = "none";
        victoryFanfare.pause();
        victoryFanfare.currentTime = 0;
      }, 30000);
    } else {
      console.log("You lose!");
      defeatScreen.style.display = "flex";
      if (game.soundIsActive) {
        defeatFanfare.play();
      }
      setTimeout(() => {
        defeatScreen.style.display = "none";
        defeatFanfare.pause();
        defeatFanfare.currentTime = 0;
      }, 30000);
    }
    this.reset();
  }

  reset() {
    timer.reset();
    timer.printTime();
    moleHoles.forEach((instance) => {
      instance.stopGenerating();
      instance.hide();
    });
    moleHoles.splice(0);
    this.isStarted = false;
    this.isPaused = false;
    this.score = 0;
    this.totalMoles = 0;
    this.displayScore();
    pauseButton.textContent = "Pause";
    player.hide();
    player.getStartingCell();
    player.show();
    startButton.textContent = "Start";
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
}

function fisherYatesShuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[j];
    arr[j] = arr[i - 1];
    arr[i - 1] = temp;
  }
}

function getRandomSelection(n, array) {
  const cloned = array.filter((cell) => {
    if (
      parseInt(cell.dataset.index) === 0 ||
      parseInt(cell.dataset.index) === board.width + 1 ||
      parseInt(cell.dataset.index) === board.width - 1 ||
      parseInt(cell.dataset.index) === board.width * board.height - 1 ||
      parseInt(cell.dataset.index) === board.width * (board.height - 1)
    ) {
      return false;
    }
    if (parseInt(cell.dataset.index) % 2 === 0) {
      return true;
    }
  });
  fisherYatesShuffle(cloned);
  const selected = cloned.slice(0, n);
  return selected;
}

function distributeHoles() {
  if (!game.isStarted) {
    let nbOfHoles = 0;
    switch (game.difficultySetting) {
      case "easy":
        nbOfHoles = 6;
        break;
      case "medium":
        nbOfHoles = 7;
        break;
      case "hard":
        nbOfHoles = 8;
        break;
    }
    const selection = getRandomSelection(nbOfHoles, board.cells);
    for (let i = 0; i < nbOfHoles; i++) {
      let hole = new MoleHole();
      hole.cell = selection[i];
      moleHoles.push(hole);
      hole.show();
    }
  }
}

function delayedStart(holes) {
  let ticks = 0;
  let index = 0;
  const interval = setInterval(() => {
    let number = Math.floor(Math.random() * 100);
    if (number <= 90) {
      ticks++;
    }
    if (ticks % 50 === 0) {
      moleHoles[index].startGenerating();
      index++;
    }
    if (!game.isStarted || index === moleHoles.length) {
      clearInterval(interval);
    }
  }, 10);
}
