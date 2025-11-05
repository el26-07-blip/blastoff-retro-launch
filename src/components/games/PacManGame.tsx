import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const PacManGame = () => {
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

    canvas.width = 600;
    canvas.height = 600;

    const gridSize = 30;
    const tileCount = 20;

    // Simple maze layout
    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
      [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
      [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
      [1,1,1,1,0,1,0,1,1,2,2,1,1,0,1,0,1,1,1,1],
      [0,0,0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0,0,0],
      [1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1],
      [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
      [1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
      [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let pellets: boolean[][] = maze.map(row => row.map(cell => cell === 0));
    let pacman = { x: 1, y: 1, direction: 0, nextDirection: 0, mouth: 0 };
    let ghosts = [
      { x: 9, y: 9, color: '#ff0000', dx: 1, dy: 0 },
      { x: 10, y: 9, color: '#00ffff', dx: -1, dy: 0 },
      { x: 9, y: 10, color: '#ffb8ff', dx: 0, dy: 1 },
      { x: 10, y: 10, color: '#ffb852', dx: 0, dy: -1 }
    ];
    let currentScore = 0;
    let currentLives = 3;
    let powerMode = false;
    let powerTimer = 0;

    const totalPellets = pellets.flat().filter(p => p).length;

    const canMove = (x: number, y: number) => {
      return maze[y] && maze[y][x] !== 1;
    };

    const drawMaze = () => {
      maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            ctx.fillStyle = '#0099ff';
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
          }
        });
      });
    };

    const drawPellets = () => {
      pellets.forEach((row, y) => {
        row.forEach((hasPellet, x) => {
          if (hasPellet) {
            ctx.fillStyle = '#ffff00';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#ffff00';
            ctx.beginPath();
            ctx.arc(
              x * gridSize + gridSize / 2,
              y * gridSize + gridSize / 2,
              3,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
    };

    const drawPacman = () => {
      const centerX = pacman.x * gridSize + gridSize / 2;
      const centerY = pacman.y * gridSize + gridSize / 2;
      const radius = gridSize / 2 - 2;

      pacman.mouth = (pacman.mouth + 0.1) % 1;
      const mouthAngle = Math.abs(Math.sin(pacman.mouth * Math.PI)) * 0.3;

      ctx.fillStyle = '#ffff00';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        pacman.direction + mouthAngle,
        pacman.direction + Math.PI * 2 - mouthAngle
      );
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawGhosts = () => {
      ghosts.forEach(ghost => {
        const centerX = ghost.x * gridSize + gridSize / 2;
        const centerY = ghost.y * gridSize + gridSize / 2;

        ctx.fillStyle = powerMode ? '#0000ff' : ghost.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = powerMode ? '#0000ff' : ghost.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 5, gridSize / 2 - 2, Math.PI, 0);
        ctx.lineTo(centerX + gridSize / 2 - 2, centerY + gridSize / 2 - 2);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(centerX - gridSize / 2 + 2, centerY + gridSize / 2 - 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const updatePacman = () => {
      const directions = [
        { dx: 1, dy: 0, angle: 0 },
        { dx: 0, dy: 1, angle: Math.PI / 2 },
        { dx: -1, dy: 0, angle: Math.PI },
        { dx: 0, dy: -1, angle: Math.PI * 1.5 }
      ];

      const next = directions[pacman.nextDirection];
      if (canMove(pacman.x + next.dx, pacman.y + next.dy)) {
        pacman.direction = next.angle;
        pacman.x += next.dx;
        pacman.y += next.dy;
      } else {
        const current = directions[pacman.direction / (Math.PI / 2)];
        if (current && canMove(pacman.x + current.dx, pacman.y + current.dy)) {
          pacman.x += current.dx;
          pacman.y += current.dy;
        }
      }

      if (pellets[pacman.y][pacman.x]) {
        pellets[pacman.y][pacman.x] = false;
        currentScore += 10;
        setScore(currentScore);

        if (!pellets.flat().some(p => p)) {
          setGameWon(true);
        }
      }
    };

    const updateGhosts = () => {
      ghosts.forEach(ghost => {
        const possibleMoves = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ].filter(move => canMove(ghost.x + move.dx, ghost.y + move.dy));

        if (possibleMoves.length > 0) {
          const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          ghost.x += move.dx;
          ghost.y += move.dy;
        }

        if (ghost.x === pacman.x && ghost.y === pacman.y) {
          if (powerMode) {
            ghost.x = 9 + Math.floor(Math.random() * 2);
            ghost.y = 9 + Math.floor(Math.random() * 2);
            currentScore += 200;
            setScore(currentScore);
          } else {
            currentLives--;
            setLives(currentLives);
            if (currentLives === 0) {
              setGameOver(true);
            } else {
              pacman.x = 1;
              pacman.y = 1;
            }
          }
        }
      });
    };

    const drawGame = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawMaze();
      drawPellets();
      drawPacman();
      drawGhosts();
    };

    const gameLoop = setInterval(() => {
      if (!gameOver && !gameWon) {
        updatePacman();
        updateGhosts();
        drawGame();

        if (powerMode) {
          powerTimer--;
          if (powerTimer <= 0) {
            powerMode = false;
          }
        }
      }
    }, 200);

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "d":
          pacman.nextDirection = 0;
          break;
        case "ArrowDown":
        case "s":
          pacman.nextDirection = 1;
          break;
        case "ArrowLeft":
        case "a":
          pacman.nextDirection = 2;
          break;
        case "ArrowUp":
        case "w":
          pacman.nextDirection = 3;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyPress);
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
            Arrow keys or WASD to move
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
