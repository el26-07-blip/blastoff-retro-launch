import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const BreakoutGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    const paddleWidth = 100;
    const paddleHeight = 15;
    const ballRadius = 8;
    const brickRowCount = 5;
    const brickColumnCount = 10;
    const brickWidth = 70;
    const brickHeight = 20;
    const brickPadding = 5;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 35;

    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballSpeedX = 4;
    let ballSpeedY = -4;
    let currentScore = 0;
    let currentLives = 3;

    const bricks: { x: number; y: number; status: number }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            const hue = (r / brickRowCount) * 180 + 180;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            ctx.shadowBlur = 0;
          }
        }
      }
    };

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              ballSpeedY = -ballSpeedY;
              b.status = 0;
              currentScore += 10;
              setScore(currentScore);

              if (currentScore === brickRowCount * brickColumnCount * 10) {
                setGameWon(true);
              }
            }
          }
        }
      }
    };

    const drawBall = () => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ff99";
      ctx.fillStyle = "#00ff99";
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawPaddle = () => {
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#0099ff";
      ctx.fillStyle = "#0099ff";
      ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;
    };

    const drawGame = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
      }

      if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
      } else if (ballY + ballSpeedY > canvas.height - ballRadius - 10) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          ballSpeedY = -ballSpeedY;
          const hitPos = (ballX - paddleX) / paddleWidth - 0.5;
          ballSpeedX = hitPos * 8;
        } else {
          currentLives--;
          setLives(currentLives);
          if (currentLives === 0) {
            setGameOver(true);
          } else {
            ballX = canvas.width / 2;
            ballY = canvas.height - 30;
            ballSpeedX = 4;
            ballSpeedY = -4;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }
    };

    const gameLoop = setInterval(() => {
      if (!gameOver && !gameWon) {
        drawGame();
      }
    }, 1000 / 60);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      if (mouseX > 0 && mouseX < canvas.width) {
        paddleX = mouseX - paddleWidth / 2;
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameStarted, gameOver, gameWon]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeout(startGame, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-bold">
          Score: {score} | Lives: {lives}
        </div>
        <Button onClick={resetGame} size="sm" variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="relative glass-card rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="block" />
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Start Game
            </Button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-destructive">Game Over!</h3>
              <p className="text-xl">Final Score: {score}</p>
              <Button onClick={resetGame} size="lg" className="gap-2">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </Button>
            </div>
          </div>
        )}
        {gameWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-primary neon-glow">You Win!</h3>
              <p className="text-xl">Perfect Score: {score}</p>
              <Button onClick={resetGame} size="lg" className="gap-2">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
