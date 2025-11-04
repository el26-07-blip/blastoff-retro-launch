import { Gamepad2, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userLevel: number;
  userXP: number;
  onProfileClick: () => void;
}

export const Header = ({ userLevel, userXP, onProfileClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary animate-float" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">Retro Arcade</h1>
              <p className="text-xs text-muted-foreground">Made by Liam</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Trophy className="w-4 h-4 text-accent" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">Level {userLevel}</span>
                <span className="text-muted-foreground ml-2">{userXP} XP</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full glass-card-hover"
              onClick={onProfileClick}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
