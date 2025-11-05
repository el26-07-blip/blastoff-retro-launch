import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Play, X } from "lucide-react";
import { Game } from "@/data/games";
import { SnakeGame } from "./games/SnakeGame";
import { PongGame } from "./games/PongGame";
import { BreakoutGame } from "./games/BreakoutGame";
import { TetrisGame } from "./games/TetrisGame";
import { PacManGame } from "./games/PacManGame";
import { SpaceInvadersGame } from "./games/SpaceInvadersGame";
import { FlappyGame } from "./games/FlappyGame";
import { PlatformerGame } from "./games/PlatformerGame";
import { Game2048 } from "./games/Game2048";

interface GameModalProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
}

export const GameModal = ({ game, open, onClose }: GameModalProps) => {
  if (!game) return null;

  const renderGame = () => {
    switch (game.id) {
      case "snake":
        return <SnakeGame />;
      case "pong":
        return <PongGame />;
      case "breakout":
        return <BreakoutGame />;
      case "tetris":
        return <TetrisGame />;
      case "pacman":
        return <PacManGame />;
      case "space":
        return <SpaceInvadersGame />;
      case "flappy-bird":
        return <FlappyGame />;
      case "mario":
      case "super-plumber":
        return <PlatformerGame />;
      case "2048":
        return <Game2048 />;
      default:
        // Category-based fallback so every game is playable
        const cat = game.category.toLowerCase();
        if (["arcade", "shooter", "classic", "casual"].includes(cat)) return <SpaceInvadersGame />;
        if (["puzzle", "strategy", "card", "simulation"].includes(cat)) return <Game2048 />;
        if (["adventure", "platformer", "rpg", "horror"].includes(cat)) return <PlatformerGame />;
        if (["sports", "racing", "fighting", "rhythm", "bonus"].includes(cat)) return <PongGame />;
        return <SnakeGame />;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{game.icon}</span>
            <span>{game.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="font-medium">{game.rating}</span>
            </div>
            <div className="text-muted-foreground">{game.plays.toLocaleString()} plays</div>
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-xs text-primary font-semibold">Level {game.level}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{game.description}</p>

          {renderGame()}

          <div className="text-center text-sm text-muted-foreground">
            <p>Use arrow keys or WASD to play • Press ESC to quit</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
