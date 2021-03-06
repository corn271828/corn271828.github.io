export function breakout() {
    const canvas = document.getElementById("myCanvas");

    canvas.addEventListener('click', ev => canvas.focus())
    const ctx = canvas.getContext("2d");

    let selection = 0;
    const difficulties = ["Easy", "Hard", "Insane", "Lunatic", "Bruh", "Ultra-Bruh", "Super-Ultra-Bruh", "Super-Duper-Ultra-Bruh"]

    let beginScreenOver = false;

    function drawBeginScreen() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [i, name] of difficulties.entries()) {
        ctx.font = (selection == i ? "bold " : "") + "16px Arial";
        ctx.fillStyle = selection == i ? "#11A6EE" : "#0095DD";
        ctx.fillText(name, 20, 30 + 30 * i);
      }
    }

    function keySelectionHandler(e) {
        switch (e.key) {
          case "Down":
          case "ArrowDown":
            selection = (selection + 1) % difficulties.length;
            break;
          case "Up":
          case "ArrowUp":
            selection = (selection + difficulties.length - 1) % difficulties.length;
            break;
          case "Enter":
            if (!beginScreenOver) {
                beginScreenOver = true;
                postBeginScreen();
            }
            break;
        }
    }

    canvas.focus();


    canvas.addEventListener("keydown", keySelectionHandler, false);

    const beginInterval = setInterval(drawBeginScreen, 25);

    function postBeginScreen() {
      canvas.removeEventListener("keydown", keySelectionHandler, false);
      clearInterval(beginInterval);

      const Status = {
        DEAD: 0,
        ALIVE: 1,
      };

      let x = canvas.width / 2;
      let y = canvas.height / 2;
      if (selection > 5) {
        y += (selection - 5) * 20;
      }

      const ballradius = 10;

      let dx = 2 + selection;
      let dy = 2 + selection;

      const paddleHeight = 10;
      const paddleWidth = 75;
      let paddleX = (canvas.width - paddleWidth) / 2;
      let paddleY = canvas.height - paddleHeight - 10;

      const brickRows = selection + 2;
      const brickCols = selection * 2 + 3;
      const brickHeight = 20;
      const brickPadding = 10;
      const brickOffsetTop = 30;
      const brickOffsetLeft = 30;
      const brickWidth = (canvas.width - brickOffsetLeft * 2 - brickPadding * (brickCols - 1)) / brickCols;
      const bricks = [];

      let score = 0;
      let bricksbroken = 0, bricksToBreak = brickRows * brickCols;

      function drawball() {
        ctx.beginPath();
        ctx.arc(x, y, ballradius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      function drawBricks() {
        for (const brick of bricks) {
          if (brick.status != Status.ALIVE) {
            continue;
          }
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }

      function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: "+score, 8, 20);
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collisionDetection();
        drawball();
        drawPaddle();
        drawBricks();
        drawScore();

        if (y + dy < ballradius) {
          dy = -dy;
        } else if (x > paddleX && x < paddleX + paddleWidth && y + dy < paddleY + paddleHeight + ballradius && y + dy >= paddleY - ballradius && dy > 0) {
          dy = -dy;
        } else if (y > canvas.height - ballradius) {
          ctx.font = "60px Arial";
          ctx.fillStyle = "#0095DD";
          ctx.fillText("Game Over", 8, canvas.height / 2 + 30);
          clearInterval(interval);
        }

        if (x + dx < ballradius || x + dx > canvas.width - ballradius) {
          dx = -dx;
        }

        x += dx;
        y += dy;

        if (rightDown()) {
          paddleX += 7;
          if (paddleX > canvas.width - paddleWidth) {
            paddleX = canvas.width - paddleWidth;
          }
        }
        if (leftDown()) {
          paddleX -= 7;
          if (paddleX < 0) {
            paddleX = 0;
          }
        }
      }

      const pressed = new Set();
      function keyDownHandler(e) {
        pressed.add(e.key);
      } 

      function keyUpHandler(e) {
        pressed.delete(e.key);
      } 

      const leftDown = () => pressed.has("Left") || pressed.has("ArrowLeft");
      const rightDown = () => pressed.has("Right") || pressed.has("ArrowRight");

      function collisionDetection() {
        for (const b of bricks) {
          if (b.status != Status.ALIVE) {
            continue;
          }
          if (x > b.x - ballradius && x < b.x + brickWidth + ballradius && y > b.y - ballradius && y < b.y + brickHeight + ballradius) {
            dy = -dy;
            b.status = Status.DEAD;
            bricksbroken++;
            score += 100;

            if (bricksbroken == bricksToBreak) {
              clearInterval(interval);
              ctx.font = "60px Arial";
              ctx.fillStyle = "#0095DD";
              ctx.fillText("Congratulations", 30, 100);
            }
          }
        }
      }

      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          bricks.push({
            x: c * (brickWidth + brickPadding) + brickOffsetLeft,
            y: r * (brickHeight + brickPadding) + brickOffsetTop,
            status: Status.ALIVE,
          });
        }
      }


      canvas.addEventListener("keydown", keyDownHandler, false);
      canvas.addEventListener("keyup", keyUpHandler, false);

      const interval = setInterval(draw, 25);
    }
}