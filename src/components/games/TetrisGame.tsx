import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 25;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f5ff' },
  O: { shape: [[1, 1], [1, 1]], color: '#ffd700' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a020f0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000ff' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff8800' }
};

export const TetrisGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = BOARD_WIDTH * BLOCK_SIZE;
    canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

    let board: number[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    let currentPiece: any = null;
    let currentX = 0;
    let currentY = 0;
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let currentScore = 0;
    let currentLevel = 1;
    let currentLines = 0;

    const getRandomPiece = () => {
      const pieces = Object.keys(TETROMINOS);
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
      return TETROMINOS[randomPiece as keyof typeof TETROMINOS];
    };

    const createPiece = () => {
      currentPiece = getRandomPiece();
      currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
      currentY = 0;

      if (hasCollision()) {
        setGameOver(true);
      }
    };

    const hasCollision = (offsetX = 0, offsetY = 0, piece = currentPiece.shape) => {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            const newX = currentX + x + offsetX;
            const newY = currentY + y + offsetY;

            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return true;
            }

            if (newY >= 0 && board[newY][newX]) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const mergePiece = () => {
      currentPiece.shape.forEach((row: number[], y: number) => {
        row.forEach((value: number, x: number) => {
          if (value) {
            board[currentY + y][currentX + x] = 1;
          }
        });
      });
    };

    const clearLines = () => {
      let linesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell === 1)) {
          board.splice(y, 1);
          board.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        currentLines += linesCleared;
        currentScore += linesCleared * 100 * currentLevel;
        currentLevel = Math.floor(currentLines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (currentLevel - 1) * 100);
        
        setLines(currentLines);
        setScore(currentScore);
        setLevel(currentLevel);
      }
    };

    const rotate = () => {
      const rotated = currentPiece.shape[0].map((_: any, i: number) =>
        currentPiece.shape.map((row: number[]) => row[i]).reverse()
      );

      if (!hasCollision(0, 0, rotated)) {
        currentPiece.shape = rotated;
      }
    };

    const drop = () => {
      if (!hasCollision(0, 1)) {
        currentY++;
      } else {
        mergePiece();
        clearLines();
        createPiece();
      }
    };

    const drawBlock = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, 4);
    };

    const drawBoard = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(0, 153, 255, 0.1)";
      for (let i = 0; i <= BOARD_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= BOARD_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw placed blocks
      board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            drawBlock(x, y, '#0099ff');
          }
        });
      });

      // Draw current piece
      if (currentPiece) {
        currentPiece.shape.forEach((row: number[], y: number) => {
          row.forEach((value: number, x: number) => {
            if (value) {
              drawBlock(currentX + x, currentY + y, currentPiece.color);
            }
          });
        });
      }
    };

    const update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;

      if (dropCounter > dropInterval) {
        drop();
        dropCounter = 0;
      }

      drawBoard();
      if (!gameOver) {
        requestAnimationFrame(update);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentPiece) return;
      
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          if (!hasCollision(-1, 0)) currentX--;
          break;
        case "ArrowRight":
        case "d":
          if (!hasCollision(1, 0)) currentX++;
          break;
        case "ArrowDown":
        case "s":
          drop();
          break;
        case "ArrowUp":
        case "w":
        case " ":
          rotate();
          break;
      }
    };

    createPiece();
    window.addEventListener("keydown", handleKeyPress);
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);
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
          <div className="text-sm text-muted-foreground">Level: {level} | Lines: {lines}</div>
          <div className="text-xs text-muted-foreground">
            ⬅️➡️ Move | ⬆️ Rotate | ⬇️ Drop
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
              <p className="text-sm">Level {level} | {lines} Lines</p>
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
