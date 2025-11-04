import { Play, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  level: number;
  unlocked: boolean;
  rating: number;
  plays: number;
  onClick: () => void;
}

export const GameCard = ({
  title,
  category,
  icon,
  level,
  unlocked,
  rating,
  plays,
  onClick,
}: GameCardProps) => {
  return (
    <div
      onClick={unlocked ? onClick : undefined}
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden group animate-scale-in",
        unlocked ? "glass-card-hover cursor-pointer" : "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          {unlocked ? (
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-xs text-primary font-semibold">LVL {level}</span>
            </div>
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">{plays.toLocaleString()} plays</span>
          </div>

          {unlocked && (
            <div className="glass-card p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Play className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
