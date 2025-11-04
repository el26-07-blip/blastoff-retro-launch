import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [foodType, setFoodType] = useState<'normal' | 'golden' | 'power'>('normal');
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 25;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let newScore = 0;
    let currentSpeed = speed;
    let currentFoodType: 'normal' | 'golden' | 'power' = 'normal';
    let powerUpActive = false;
    let powerUpTimer = 0;

    const generateFood = () => {
      const rand = Math.random();
      currentFoodType = rand > 0.9 ? 'golden' : rand > 0.7 ? 'power' : 'normal';
      setFoodType(currentFoodType);
      return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
    };

    food = generateFood();

    const drawGame = () => {
      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(0, 153, 255, 0.1)";
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Move snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        if (currentFoodType === 'golden') {
          newScore += 50;
          currentSpeed = Math.max(50, currentSpeed - 5);
        } else if (currentFoodType === 'power') {
          newScore += 30;
          powerUpActive = true;
          powerUpTimer = 50;
        } else {
          newScore += 10;
        }
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        food = generateFood();
      } else {
        snake.pop();
      }

      // Handle power-up
      if (powerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
          powerUpActive = false;
        }
      }

      // Draw food with different colors and effects
      ctx.shadowBlur = 25;
      if (currentFoodType === 'golden') {
        ctx.shadowColor = "#ffd700";
        ctx.fillStyle = "#ffd700";
      } else if (currentFoodType === 'power') {
        ctx.shadowColor = "#ff00ff";
        ctx.fillStyle = "#ff00ff";
      } else {
        ctx.shadowColor = "#00c8ff";
        ctx.fillStyle = "#00c8ff";
      }
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw snake with power-up effect
      snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
          segment.x * gridSize,
          segment.y * gridSize,
          (segment.x + 1) * gridSize,
          (segment.y + 1) * gridSize
        );
        if (powerUpActive) {
          gradient.addColorStop(0, index === 0 ? "#ff00ff" : "#cc00cc");
          gradient.addColorStop(1, index === 0 ? "#ff66ff" : "#ff00ff");
        } else {
          gradient.addColorStop(0, index === 0 ? "#0099ff" : "#0066cc");
          gradient.addColorStop(1, index === 0 ? "#00c8ff" : "#0099ff");
        }
        ctx.fillStyle = gradient;
        
        if (index === 0) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = powerUpActive ? "#ff00ff" : "#00c8ff";
        }
        
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        ctx.shadowBlur = 0;
      });
    };

    const gameLoop = setInterval(() => {
      if (dx === 0 && dy === 0) return;
      drawGame();
    }, currentSpeed);

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (dy === 0) {
            dx = 0;
            dy = -1;
          }
          break;
        case "ArrowDown":
        case "s":
          if (dy === 0) {
            dx = 0;
            dy = 1;
          }
          break;
        case "ArrowLeft":
        case "a":
          if (dx === 0) {
            dx = -1;
            dy = 0;
          }
          break;
        case "ArrowRight":
        case "d":
          if (dx === 0) {
            dx = 1;
            dy = 0;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    gameRef.current = { gameLoop, handleKeyPress };

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeout(startGame, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="text-2xl font-bold">Score: {score}</div>
          <div className="text-sm text-muted-foreground">High Score: {highScore}</div>
          {foodType === 'golden' && (
            <div className="text-xs text-yellow-400">🌟 Golden Apple: +50pts & Speed Boost!</div>
          )}
          {foodType === 'power' && (
            <div className="text-xs text-purple-400">⚡ Power Apple: +30pts & Invincibility!</div>
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
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-primary neon-glow">Game Over!</h3>
              <p className="text-xl">Final Score: {score}</p>
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
