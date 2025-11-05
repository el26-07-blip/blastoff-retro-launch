import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const Game2048 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 500;

    const gridSize = 4;
    const tileSize = 110;
    const tileMargin = 15;

    let grid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    let currentScore = 0;
    let hasWon = false;

    const colors: { [key: number]: string } = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };

    const addRandomTile = () => {
      const emptyCells = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (grid[i][j] === 0) {
            emptyCells.push({ i, j });
          }
        }
      }

      if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
      }
    };

    const drawTile = (value: number, x: number, y: number) => {
      const tileX = tileMargin + x * (tileSize + tileMargin);
      const tileY = tileMargin + y * (tileSize + tileMargin);

      ctx.fillStyle = colors[value] || '#3c3a32';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(tileX, tileY, tileSize, tileSize);
      ctx.shadowBlur = 0;

      if (value > 0) {
        ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
        ctx.font = value < 100 ? 'bold 55px Arial' : value < 1000 ? 'bold 45px Arial' : 'bold 35px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value.toString(), tileX + tileSize / 2, tileY + tileSize / 2);
      }
    };

    const drawGrid = () => {
      ctx.fillStyle = '#bbada0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          drawTile(grid[i][j], j, i);
        }
      }
    };

    const move = (direction: string) => {
      let moved = false;
      const newGrid = grid.map(row => [...row]);

      const compress = (line: number[]) => {
        const newLine = line.filter(val => val !== 0);
        while (newLine.length < gridSize) {
          newLine.push(0);
        }
        return newLine;
      };

      const merge = (line: number[]) => {
        for (let i = 0; i < gridSize - 1; i++) {
          if (line[i] !== 0 && line[i] === line[i + 1]) {
            line[i] *= 2;
            line[i + 1] = 0;
            currentScore += line[i];
            setScore(currentScore);
            if (currentScore > bestScore) {
              setBestScore(currentScore);
            }
            if (line[i] === 2048 && !hasWon) {
              hasWon = true;
              setGameWon(true);
            }
          }
        }
        return line;
      };

      if (direction === 'left') {
        for (let i = 0; i < gridSize; i++) {
          let line = compress(newGrid[i]);
          line = merge(line);
          newGrid[i] = compress(line);
        }
      } else if (direction === 'right') {
        for (let i = 0; i < gridSize; i++) {
          let line = compress(newGrid[i].reverse());
          line = merge(line);
          newGrid[i] = compress(line).reverse();
        }
      } else if (direction === 'up') {
        for (let j = 0; j < gridSize; j++) {
          let line = compress([newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]]);
          line = merge(line);
          line = compress(line);
          for (let i = 0; i < gridSize; i++) {
            newGrid[i][j] = line[i];
          }
        }
      } else if (direction === 'down') {
        for (let j = 0; j < gridSize; j++) {
          let line = compress([newGrid[3][j], newGrid[2][j], newGrid[1][j], newGrid[0][j]]);
          line = merge(line);
          line = compress(line);
          for (let i = 0; i < gridSize; i++) {
            newGrid[gridSize - 1 - i][j] = line[i];
          }
        }
      }

      // Check if move changed anything
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (grid[i][j] !== newGrid[i][j]) {
            moved = true;
            break;
          }
        }
      }

      if (moved) {
        grid = newGrid;
        addRandomTile();
        drawGrid();
        checkGameOver();
      }
    };

    const checkGameOver = () => {
      // Check if any cells are empty
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (grid[i][j] === 0) return;
        }
      }

      // Check if any adjacent cells can merge
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (
            (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) ||
            (i < gridSize - 1 && grid[i][j] === grid[i + 1][j])
          ) {
            return;
          }
        }
      }

      setGameOver(true);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
          move('right');
          break;
        case 'ArrowUp':
        case 'w':
          move('up');
          break;
        case 'ArrowDown':
        case 's':
          move('down');
          break;
      }
    };

    addRandomTile();
    addRandomTile();
    drawGrid();

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
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
          <div className="text-2xl font-bold">
            Score: {score}
          </div>
          <div className="text-sm text-muted-foreground">Best: {bestScore}</div>
          <div className="text-xs text-muted-foreground">
            Arrow keys or WASD to play
          </div>
        </div>
        <Button onClick={resetGame} size="sm" variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Game
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
                Try Again
              </Button>
            </div>
          </div>
        )}
        {gameWon && !gameOver && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary/90 px-6 py-3 rounded-lg">
            <p className="text-xl font-bold text-primary-foreground">You reached 2048! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};
