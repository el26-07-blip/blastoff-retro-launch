import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Play, X } from "lucide-react";
import { Game } from "@/data/games";
import { SnakeGame } from "./games/SnakeGame";
import { PongGame } from "./games/PongGame";
import { BreakoutGame } from "./games/BreakoutGame";

interface GameModalProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
}

export const GameModal = ({ game, open, onClose }: GameModalProps) => {
  if (!game) return null;

  const renderGame = () => {
    if (!game.playable) {
      return (
        <div className="flex items-center justify-center h-96 glass-card rounded-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">{game.icon}</div>
            <p className="text-xl font-semibold mb-2">Coming Soon!</p>
            <p className="text-muted-foreground">This game is being polished for you.</p>
          </div>
        </div>
      );
    }

    switch (game.id) {
      case "snake":
        return <SnakeGame />;
      case "pong":
        return <PongGame />;
      case "breakout":
        return <BreakoutGame />;
      default:
        return null;
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

          {game.playable && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Use arrow keys or WASD to play • Press ESC to quit</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
