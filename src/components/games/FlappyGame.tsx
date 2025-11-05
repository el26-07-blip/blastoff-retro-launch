import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const FlappyGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    let bird = { x: 100, y: 300, velocity: 0, radius: 15 };
    let pipes: any[] = [];
    let currentScore = 0;
    let frameCount = 0;

    const gravity = 0.5;
    const jumpPower = -8;
    const pipeGap = 150;
    const pipeWidth = 50;

    const createPipe = () => {
      const minHeight = 100;
      const maxHeight = canvas.height - pipeGap - 100;
      const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + pipeGap,
        scored: false
      });
    };

    const drawBird = () => {
      ctx.fillStyle = '#ffff00';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye
      ctx.fillStyle = '#000000';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Beak
      ctx.fillStyle = '#ff8800';
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.radius, bird.y);
      ctx.lineTo(bird.x + bird.radius + 10, bird.y - 2);
      ctx.lineTo(bird.x + bird.radius + 10, bird.y + 2);
      ctx.closePath();
      ctx.fill();
    };

    const drawPipes = () => {
      pipes.forEach(pipe => {
        // Top pipe
        ctx.fillStyle = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff00';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
        ctx.shadowBlur = 0;
        
        // Pipe highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(pipe.x, 0, 5, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, 5, canvas.height - pipe.bottomY);
      });
    };

    const updateBird = () => {
      bird.velocity += gravity;
      bird.y += bird.velocity;

      // Check ground/ceiling collision
      if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        setGameOver(true);
      }
    };

    const updatePipes = () => {
      if (frameCount % 90 === 0) {
        createPipe();
      }

      pipes = pipes.filter(pipe => {
        pipe.x -= 3;

        // Check collision
        if (
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + pipeWidth &&
          (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY)
        ) {
          setGameOver(true);
        }

        // Score point
        if (!pipe.scored && bird.x > pipe.x + pipeWidth) {
          pipe.scored = true;
          currentScore++;
          setScore(currentScore);
          if (currentScore > highScore) {
            setHighScore(currentScore);
          }
        }

        return pipe.x + pipeWidth > 0;
      });
    };

    const drawBackground = () => {
      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(1, '#e0f6ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 0;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(100 + i * 150, 100 + i * 50, 30, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawGame = () => {
      drawBackground();
      drawPipes();
      drawBird();

      // Score
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 40px Arial';
      ctx.strokeText(currentScore.toString(), canvas.width / 2 - 20, 60);
      ctx.fillText(currentScore.toString(), canvas.width / 2 - 20, 60);
    };

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        frameCount++;
        updateBird();
        updatePipes();
        drawGame();
      }
    }, 1000 / 60);

    const handleClick = () => {
      bird.velocity = jumpPower;
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        bird.velocity = jumpPower;
      }
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeout(startGame, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="text-2xl font-bold">Score: {score}</div>
          <div className="text-sm text-muted-foreground">High Score: {highScore}</div>
          <div className="text-xs text-muted-foreground">
            Click, Space, or ⬆️ to flap
          </div>
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
              <p className="text-xl">Score: {score}</p>
              <p className="text-sm">Best: {highScore}</p>
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
