let bounceCount = 0;
let highBounce = localStorage.getItem("highBounce") || 0;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const pauseMenu = document.getElementById("pauseMenu");
const gameOverScreen = document.getElementById("gameOverScreen");

let gameRunning = false;
let paused = false;

let ballX, ballY, ballDX, ballDY, ballRadius;
let paddleX, paddleHeight, paddleWidth;
let rightPressed = false, leftPressed = false;

function initGame() {
  bounceCount = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = 2;
  ballDY = -2;
  ballRadius = 10;

  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width - paddleWidth) / 2;

  rightPressed = false;
  leftPressed = false;
  paused = false;
}

function startGame() {
  homeScreen.style.display = "none";
  gameScreen.style.display = "block";
  pauseMenu.style.display = "none";
  gameOverScreen.style.display = "none";
  initGame();
  gameRunning = true;
  draw();
}

function goHome() {
  gameOverScreen.style.display = "none";
  gameRunning = false;
  homeScreen.style.display = "block";
  gameScreen.style.display = "none";
  pauseMenu.style.display = "none";
}

function pauseGame() {
  paused = true;
  pauseMenu.style.display = "flex";
}

function resumeGame() {
  paused = false;
  pauseMenu.style.display = "none";
  draw();
}

function restartGame() {
  gameOverScreen.style.display = "none";
  pauseMenu.style.display = "none";
  initGame();
  gameRunning = true;
  draw();
}

// Touch controls
document.getElementById("leftBtn").addEventListener("touchstart", () => leftPressed = true);
document.getElementById("leftBtn").addEventListener("touchend", () => leftPressed = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => rightPressed = true);
document.getElementById("rightBtn").addEventListener("touchend", () => rightPressed = false);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  if (!gameRunning || paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius)
    ballDX = -ballDX;
  if (ballY + ballDY < ballRadius)
    ballDY = -ballDY;
  else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
      bounceCount++;
    } else {
      showGameOver();
      return;
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  ballX += ballDX;
  ballY += ballDY;

  requestAnimationFrame(draw);
}

function showGameOver() {
  gameRunning = false;

  if (bounceCount > highBounce) {
    highBounce = bounceCount;
    localStorage.setItem("highBounce", highBounce);
  }

  document.getElementById("finalScoreText").innerText = `Your number of bounces is: ${bounceCount}`;
  gameOverScreen.style.display = "flex";
}