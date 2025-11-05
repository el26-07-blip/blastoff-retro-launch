import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const PlatformerGame = () => {
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

    let player = {
      x: 50,
      y: 350,
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
      speed: 5,
      jumpPower: 12
    };

    const platforms = [
      { x: 0, y: 450, width: 800, height: 50 },
      { x: 150, y: 380, width: 100, height: 20 },
      { x: 320, y: 320, width: 100, height: 20 },
      { x: 490, y: 260, width: 100, height: 20 },
      { x: 660, y: 200, width: 100, height: 20 },
      { x: 200, y: 150, width: 150, height: 20 }
    ];

    const coins = [
      { x: 180, y: 340, collected: false },
      { x: 350, y: 280, collected: false },
      { x: 520, y: 220, collected: false },
      { x: 690, y: 160, collected: false },
      { x: 250, y: 110, collected: false }
    ];

    const enemies = [
      { x: 300, y: 410, width: 30, height: 30, direction: 1, range: 100, startX: 300 },
      { x: 600, y: 410, width: 30, height: 30, direction: 1, range: 150, startX: 600 }
    ];

    const goal = { x: 750, y: 370, width: 30, height: 80 };

    let currentScore = 0;
    let currentLives = 3;
    const gravity = 0.6;

    const keys: any = {};

    const drawPlayer = () => {
      // Body
      ctx.fillStyle = '#ff0000';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff0000';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Hat
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(player.x, player.y - 8, player.width, 8);
      
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.shadowBlur = 0;
      ctx.fillRect(player.x + 8, player.y + 10, 5, 5);
      ctx.fillRect(player.x + 17, player.y + 10, 5, 5);
    };

    const drawPlatforms = () => {
      platforms.forEach(platform => {
        ctx.fillStyle = '#8b4513';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#8b4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Grass on top
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
        ctx.shadowBlur = 0;
      });
    };

    const drawCoins = () => {
      coins.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#ffd700';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ffd700';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };

    const drawEnemies = () => {
      enemies.forEach(enemy => {
        ctx.fillStyle = '#800080';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#800080';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Eyes
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 0;
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 6, 6);
        ctx.fillRect(enemy.x + 19, enemy.y + 8, 6, 6);
      });
    };

    const drawGoal = () => {
      ctx.fillStyle = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ff00';
      ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
      
      // Flag
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(goal.x + goal.width / 2, goal.y);
      ctx.lineTo(goal.x + goal.width / 2 + 30, goal.y + 15);
      ctx.lineTo(goal.x + goal.width / 2, goal.y + 30);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const checkPlatformCollision = (x: number, y: number, width: number, height: number) => {
      for (let platform of platforms) {
        if (
          x < platform.x + platform.width &&
          x + width > platform.x &&
          y + height > platform.y &&
          y + height < platform.y + platform.height &&
          player.velocityY >= 0
        ) {
          return platform;
        }
      }
      return null;
    };

    const updatePlayer = () => {
      // Horizontal movement
      if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -player.speed;
      } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = player.speed;
      } else {
        player.velocityX = 0;
      }

      player.x += player.velocityX;
      player.velocityY += gravity;
      player.y += player.velocityY;

      // Check platform collision
      const platform = checkPlatformCollision(player.x, player.y, player.width, player.height);
      if (platform) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
      }

      // Boundaries
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
      if (player.y > canvas.height) {
        currentLives--;
        setLives(currentLives);
        if (currentLives === 0) {
          setGameOver(true);
        } else {
          player.x = 50;
          player.y = 350;
          player.velocityY = 0;
        }
      }

      // Coin collection
      coins.forEach(coin => {
        if (!coin.collected) {
          const dist = Math.sqrt(
            Math.pow(coin.x - (player.x + player.width / 2), 2) +
            Math.pow(coin.y - (player.y + player.height / 2), 2)
          );
          if (dist < 20) {
            coin.collected = true;
            currentScore += 100;
            setScore(currentScore);
          }
        }
      });

      // Enemy collision
      enemies.forEach(enemy => {
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          currentLives--;
          setLives(currentLives);
          if (currentLives === 0) {
            setGameOver(true);
          } else {
            player.x = 50;
            player.y = 350;
          }
        }
      });

      // Goal
      if (
        player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y
      ) {
        setGameWon(true);
      }
    };

    const updateEnemies = () => {
      enemies.forEach(enemy => {
        enemy.x += enemy.direction * 2;
        if (enemy.x > enemy.startX + enemy.range || enemy.x < enemy.startX) {
          enemy.direction *= -1;
        }
      });
    };

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(1, '#e0f6ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawGame = () => {
      drawBackground();
      drawPlatforms();
      drawCoins();
      drawEnemies();
      drawGoal();
      drawPlayer();
    };

    const gameLoop = setInterval(() => {
      if (!gameOver && !gameWon) {
        updatePlayer();
        updateEnemies();
        drawGame();
      }
    }, 1000 / 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !player.jumping) {
        player.velocityY = -player.jumpPower;
        player.jumping = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            Score: {score} | Lives: {lives}
          </div>
          <div className="text-xs text-muted-foreground">
            ⬅️➡️ Move | Space/⬆️ Jump | Collect coins, avoid enemies!
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
              <h3 className="text-3xl font-bold text-primary neon-glow">Level Complete!</h3>
              <p className="text-xl">Score: {score}</p>
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
