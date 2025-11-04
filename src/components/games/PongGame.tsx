import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [powerUpActive, setPowerUpActive] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballSize = 10;

    let playerY = canvas.height / 2 - paddleHeight / 2;
    let aiY = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;
    let playerScore = 0;
    let aiScore = 0;
    let powerUp = { x: 0, y: 0, active: false, timer: 0 };
    let paddleBoost = 1;
    const aiSpeed = difficulty === 'easy' ? 2.5 : difficulty === 'medium' ? 4 : 5.5;

    const spawnPowerUp = () => {
      if (Math.random() > 0.95 && !powerUp.active) {
        powerUp = {
          x: Math.random() * (canvas.width - 100) + 50,
          y: Math.random() * (canvas.height - 100) + 50,
          active: true,
          timer: 300,
        };
      }
    };

    const drawGame = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      ctx.strokeStyle = "rgba(0, 153, 255, 0.3)";
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles with glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#0099ff";
      ctx.fillStyle = "#0099ff";
      ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00c8ff";
      ctx.fillRect(canvas.width - 30, aiY, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;

      // Draw ball with glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ff99";
      ctx.fillStyle = "#00ff99";
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top/bottom
      if (ballY <= ballSize || ballY >= canvas.height - ballSize) {
        ballSpeedY *= -1;
      }

      // Ball collision with paddles
      if (
        (ballX <= 30 + paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
        (ballX >= canvas.width - 30 - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight)
      ) {
        ballSpeedX *= -1.1;
        ballSpeedY += (Math.random() - 0.5) * 2;
      }

      // Score points
      if (ballX <= 0) {
        aiScore++;
        setScore({ player: playerScore, ai: aiScore });
        resetBall();
      } else if (ballX >= canvas.width) {
        playerScore++;
        setScore({ player: playerScore, ai: aiScore });
        resetBall();
      }

      // Power-up logic
      spawnPowerUp();
      if (powerUp.active) {
        powerUp.timer--;
        if (powerUp.timer <= 0) {
          powerUp.active = false;
        }

        // Draw power-up
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ffff00";
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Check collision with player paddle
        const dist = Math.sqrt(
          Math.pow(powerUp.x - 25, 2) + Math.pow(powerUp.y - (playerY + paddleHeight / 2), 2)
        );
        if (dist < 25) {
          powerUp.active = false;
          paddleBoost = 1.5;
          setPowerUpActive(true);
          setTimeout(() => {
            paddleBoost = 1;
            setPowerUpActive(false);
          }, 5000);
        }
      }

      // AI movement with difficulty
      if (ballX > canvas.width / 2) {
        if (aiY + paddleHeight / 2 < ballY) {
          aiY += aiSpeed;
        } else {
          aiY -= aiSpeed;
        }
      }
    };

    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
      ballSpeedY = (Math.random() - 0.5) * 4;
    };

    const gameLoop = setInterval(drawGame, 1000 / 60);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const targetY = e.clientY - rect.top - paddleHeight / 2;
      const speed = paddleBoost * 10;
      playerY += (targetY - playerY) * (speed / 100);
      playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setScore({ player: 0, ai: 0 });
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeout(startGame, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            You: {score.player} | AI: {score.ai}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`text-xs px-3 py-1 rounded-full ${
                difficulty === 'easy' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`text-xs px-3 py-1 rounded-full ${
                difficulty === 'medium' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`text-xs px-3 py-1 rounded-full ${
                difficulty === 'hard' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Hard
            </button>
          </div>
          {powerUpActive && (
            <div className="text-xs text-yellow-400">⚡ Power Paddle Active!</div>
          )}
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
      </div>
    </div>
  );
};
