// to be able to render graphics on the <canvas> element, you need to grab a reference to it in JS:
var canvas = document.getElementById("myCanvas");
// this renders the canvas in 2d:
var ctx = canvas.getContext("2d");
// the size of the ball
var ballRadius = 10;
// the starting point of the ball
var x = canvas.width / 2;
var y = canvas.height - 30;
// adding a small value to x and y that every time a frame is drawn, it appears to move
var dx = 2;
var dy = -2;
// paddle styles
var paddleHeight = 10;
var paddleWidth = 85;
var paddleX = (canvas.width - paddleWidth) / 2;
// default that the key is not pressed: false
var rightPressed = false;
var leftPressed = false;
// how many bricks are shown:
var brickRowCount = 5;
var brickColumnCount = 6;
// brick styling
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// starting score and lives
var score = 0;
var lives = 3;

// brick columns c is a two-dimensional array
// r contains the brick rows
// y and x contain an x and y position to paint each brick on the screen
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// listen for a keydown, keyup, or a mouse move. Defaulted to not moving, and not pressed or false
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// if you press the arrow left or arrow right keys, change the function to pressed
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

// if you let go of the left or right arrow, change the function back to false
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// function to move the mouse left or right
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  // when ball radius is zero, it will bounce off of the wall
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  // ball colour styles
  ctx.fillStyle = "#3a0ca3";
  ctx.fill();
  ctx.closePath();
}
// constraints of the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fbdad4";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        // assigns brickX and brickY values rather than coordinates
        // each brickX position is brickWidth + brickPadding x column number c, plus brickOffeset
        // the logic for the brickY is identical except that it uses the values for row number, r, brickHeight, and brickOffsetTop
        var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#dc1f8f";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// the styles for the score, amount of lives
function drawScore() {
  ctx.font = "16px Helvetica";
  ctx.fillStyle = "#f8edeb";
  ctx.fillText("Score: " + score, 8, 20);
  ctx.paddingTop = '20px';
}
function drawLives() {
  ctx.font = "16px Helvetica";
  ctx.fillStyle = "#f8edeb";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// draw the ball so that it moves and doesn't leave a trail
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  // if the ball hits the left and right sides, it will collide
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  // if the ball hits the top and bottom sides, it will collide
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    // if you run out of lives, game over
    else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      // if you still have lives, keep playing
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  // if the right button is pressed, move the paddle seven pixels to the right
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  // if the left button is pressed, move the paddle seven pixels to the left
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

//draw to canvas
draw();
