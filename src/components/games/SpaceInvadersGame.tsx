import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const SpaceInvadersGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
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
    canvas.height = 600;

    let player = { x: canvas.width / 2, y: canvas.height - 60, width: 40, height: 30, speed: 5 };
    let bullets: any[] = [];
    let enemies: any[] = [];
    let enemyBullets: any[] = [];
    let currentScore = 0;
    let currentLives = 3;
    let currentWave = 1;
    let enemyDirection = 1;
    let enemySpeed = 1;

    const createEnemies = () => {
      enemies = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 10; col++) {
          enemies.push({
            x: col * 70 + 50,
            y: row * 50 + 50,
            width: 40,
            height: 30,
            alive: true
          });
        }
      }
    };

    createEnemies();

    const drawPlayer = () => {
      ctx.fillStyle = '#00ff00';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff00';
      
      // Draw spaceship
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(player.x - player.width / 2, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
    };

    const drawEnemies = () => {
      enemies.forEach(enemy => {
        if (enemy.alive) {
          ctx.fillStyle = '#ff00ff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff00ff';
          
          // Draw alien
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x + 10, enemy.y + 10, 8, 8);
          ctx.fillRect(enemy.x + 22, enemy.y + 10, 8, 8);
          
          ctx.shadowBlur = 0;
        }
      });
    };

    const drawBullets = () => {
      ctx.fillStyle = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
      });
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ff0000';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff0000';
      enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 10);
      });
      ctx.shadowBlur = 0;
    };

    const updateBullets = () => {
      bullets = bullets.filter(bullet => {
        bullet.y -= 7;
        
        // Check enemy collision
        for (let enemy of enemies) {
          if (enemy.alive &&
              bullet.x > enemy.x &&
              bullet.x < enemy.x + enemy.width &&
              bullet.y > enemy.y &&
              bullet.y < enemy.y + enemy.height) {
            enemy.alive = false;
            currentScore += 100;
            setScore(currentScore);
            return false;
          }
        }
        
        return bullet.y > 0;
      });

      enemyBullets = enemyBullets.filter(bullet => {
        bullet.y += 5;
        
        // Check player collision
        if (bullet.x > player.x - player.width / 2 &&
            bullet.x < player.x + player.width / 2 &&
            bullet.y > player.y &&
            bullet.y < player.y + player.height) {
          currentLives--;
          setLives(currentLives);
          if (currentLives === 0) {
            setGameOver(true);
          }
          return false;
        }
        
        return bullet.y < canvas.height;
      });
    };

    const updateEnemies = () => {
      let shouldMoveDown = false;
      
      enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.x += enemyDirection * enemySpeed;
          
          if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            shouldMoveDown = true;
          }

          // Random enemy shooting
          if (Math.random() < 0.001) {
            enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
          }
        }
      });

      if (shouldMoveDown) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
          enemy.y += 20;
          if (enemy.alive && enemy.y + enemy.height >= player.y) {
            setGameOver(true);
          }
        });
      }

      // Check if all enemies defeated
      if (!enemies.some(e => e.alive)) {
        currentWave++;
        setWave(currentWave);
        enemySpeed += 0.5;
        createEnemies();
      }
    };

    const drawGame = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

      drawPlayer();
      drawEnemies();
      drawBullets();
    };

    const gameLoop = setInterval(() => {
      if (!gameOver && !gameWon) {
        drawGame();
        updateBullets();
        updateEnemies();
      }
    }, 1000 / 60);

    const keys: any = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;

      if (e.key === ' ') {
        bullets.push({ x: player.x, y: player.y });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    const movePlayer = setInterval(() => {
      if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(player.width / 2, player.x - player.speed);
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(canvas.width - player.width / 2, player.x + player.speed);
      }
    }, 16);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      clearInterval(gameLoop);
      clearInterval(movePlayer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, gameWon]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
    setWave(1);
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
            Score: {score} | Lives: {lives} | Wave: {wave}
          </div>
          <div className="text-xs text-muted-foreground">
            ⬅️➡️ Move | Space to Shoot
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
              <p className="text-xl">Final Score: {score}</p>
              <p className="text-sm">Wave: {wave}</p>
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
