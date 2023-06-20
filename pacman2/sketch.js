let candyLandImg, pacmanImg, candyImg, teethImg, logo;
let pacmanSize = 50;
let candyObjs = [];
let imgX, imgY, imgWidth, imgHeight;
let countdownDate = new Date('July 3, 2023 00:00:00');

let teethSize = 0.9;
let teethWidth, teethHeight, teethX, teethY;
let teethSpeed = 0.4;
let teethDirection = 0.3;
let teethIncrement = 20;
let teethMinY, teethMaxY;

let pacmanX, pacmanY;

let score = 0;
let scoreX, scoreY;

let gameStarted = false;
let teethVisible = true;

let customFont;

let backgroundMusic;

/**
 * Preloads the images and font used in the sketch.
 */
function preload() {
  candyLandImg = loadImage('CandyLand.jpg');
  pacmanImg = loadImage('PacMan.png');
  candyImg = loadImage('Candy.png');
  teethImg = loadImage('Teeth.png');
  logo = loadImage('logo.png');
  customFont = loadFont('Pexel Grotesk.otf');
  backgroundMusic = loadSound('BackgroundMusic.mp3');
}

/**
 * Sets up the canvas and initializes variables.
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateImageSize();
  initializeTeeth();
  calculateScorePosition();
  textFont(customFont);
  setInterval(addCandy, 650); // Add candy every 2 seconds
  backgroundMusic.loop();
}

/**
 * Resets the necessary variables and reinitializes the setup.
 */
function resetGame() {
  gameStarted = false;
  score = 0;
  candyObjs = [];
  teethVisible = true;
  backgroundMusic.stop();
  setup();
}

/**
 * Draws the elements on the canvas.
 */
function draw() {
  background(0);
  image(candyLandImg, imgX, imgY, imgWidth, imgHeight);
  let logoWidth = imgWidth * 0.4; // Customize the logo width as a fraction of the CandyLand image width
  let logoHeight = logoWidth * (logo.height / logo.width); // Maintain the logo's aspect ratio
  let logoX = (windowWidth - logoWidth) / 2; // Center the logo horizontally

  drawTeeth();
  pacmanX = mouseX - pacmanSize / 2;
  pacmanY = mouseY - pacmanSize / 2;
  image(pacmanImg, pacmanX, pacmanY, pacmanSize, pacmanSize);
  if (gameStarted) {
    interactWithCandy();
  } else {
    displayStartText();
  }
  displayCountdown();
  displayScore();
  animateTeeth();
  displayRestartText();
  image(logo, logoX, imgY, logoWidth, logoHeight);
}

/**
 * Calculates the size and position of the CandyLand image based on the aspect ratio and window dimensions.
 */
function calculateImageSize() {
  let aspectRatio = candyLandImg.width / candyLandImg.height;
  imgWidth = windowHeight * 16 / 9;
  imgHeight = windowHeight;
  if (imgWidth > windowWidth) {
    imgWidth = windowWidth;
    imgHeight = windowWidth / 16 * 9;
  }
  imgX = (windowWidth - imgWidth) / 2;
  imgY = (windowHeight - imgHeight) / 2;
}

/**
 * Adds a candy object with a random position to the candyObjs array.
 */
function addCandy() {
  if (gameStarted) {
    let candyX = random(imgX, imgX + imgWidth);
    let candyY = random(imgY, imgY + imgHeight);
    let candy = {
      position: createVector(candyX, candyY)
    };
    candyObjs.push(candy);
  }
}

/**
 * Checks for interaction between the Pacman image and the candy objects, and removes any overlapping candy.
 */
function interactWithCandy() {
  for (let i = candyObjs.length - 1; i >= 0; i--) {
    let candy = candyObjs[i];
    if (
      candy.position.x >= imgX &&
      candy.position.x <= imgX + imgWidth &&
      candy.position.y >= imgY &&
      candy.position.y <= imgY + imgHeight
    ) {
      let candySize = 50;
      let candyWidth = candyImg.width * candySize / candyImg.height;
      image(candyImg, candy.position.x, candy.position.y, candyWidth, candySize);
      if (
        pacmanX + pacmanSize > candy.position.x &&
        pacmanX < candy.position.x + candyWidth &&
        pacmanY + pacmanSize > candy.position.y &&
        pacmanY < candy.position.y + candySize
      ) {
        candyObjs.splice(i, 1);
        score++;
      }
    } else {
      candyObjs.splice(i, 1);
    }
  }
}

/**
 * Draws the teeth image behind all other objects.
 */
function drawTeeth() {
  if (teethVisible) {
    teethX = (windowWidth - teethWidth) / 2;
    image(teethImg, teethX, teethY, teethWidth, teethHeight);
  }
}

/**
 * Animates the teeth image moving up and down.
 */
function animateTeeth() {
  teethY += teethSpeed * teethDirection;
  if (teethY >= teethMaxY || teethY <= teethMinY) {
    teethDirection *= -1;
  }
}

/**
 * Displays the countdown string showing the time remaining until the countdown date.
 */
function displayCountdown() {
  let now = new Date();
  let timeRemaining = countdownDate - now;
  let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  let countdownString = `Coming Out in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  // Calculate font size based on window height
  let fontSize = windowHeight * 0.03;

  fill(255);
  textAlign(CENTER, BOTTOM);
  textSize(windowWidth * 0.05);
  text(countdownString, windowWidth / 2, imgY + imgHeight - 30);
}

/**
 * Displays the score in the top-left corner of the screen.
 */
function displayScore() {
  // Calculate font size based on window height
  let fontSize = windowHeight * 0.025;

  fill(255);
  textAlign(LEFT, TOP);
  textSize(windowWidth * 0.023);
  text(`Score: ${score}`, scoreX, scoreY);
}

/**
 * Calculates the position of the score text relative to the CandyLand image.
 */
function calculateScorePosition() {
  let scoreMargin = 15;
  scoreX = imgX + scoreMargin;
  scoreY = imgY + scoreMargin;
}

/**
 * Displays the "Click to Start" text in the middle of the screen.
 */
function displayStartText() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(windowWidth * 0.025);
  text('Click to Start', width / 2, height / 2);
}

/**
 * Displays the "Restart" text in the top right corner of the CandyLand image.
 */
function displayRestartText() {
  fill(255);
  textAlign(RIGHT, TOP);
  textSize(windowWidth * 0.025);
  text('Restart', imgX + imgWidth - 15, imgY + 15);
}

/**
 * Initializes the teeth image size and position based on the screen size.
 */
function initializeTeeth() {
  teethWidth = windowWidth * teethSize;
  teethHeight = teethWidth * (teethImg.height / teethImg.width);
  teethMinY = windowHeight / 2 - teethHeight / 2 - teethSpeed * teethIncrement;
  teethMaxY = windowHeight / 2 - teethHeight / 2 + teethSpeed * teethIncrement;
  teethY = teethMinY + teethDirection * teethIncrement;

  // Reset teeth position and direction
  teethY = teethMinY;
  teethDirection = 0.3;
}

/**
 * Resizes the canvas and recalculates the image size when the window is resized.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageSize();
  initializeTeeth();
  calculateScorePosition();
}

/**
 * Handles mouse click events.
 */
function mouseClicked() {
  if (!gameStarted) {
    gameStarted = true;
    teethVisible = false;
  } else if (
    mouseX >= imgX + imgWidth - 70 &&
    mouseX <= imgX + imgWidth - 20 &&
    mouseY >= imgY &&
    mouseY <= imgY + 40
  ) {
    resetGame();
  }
}

