import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Star, Gamepad2, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  level: number;
  xp: number;
}

export const UserProfile = ({ open, onClose, level, xp }: UserProfileProps) => {
  const xpForNextLevel = level * 1000;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const achievements = [
    { icon: "🎮", title: "First Game", desc: "Play your first game", unlocked: true },
    { icon: "🔥", title: "On Fire", desc: "Play 10 games in a row", unlocked: true },
    { icon: "⭐", title: "High Scorer", desc: "Score 1000+ points", unlocked: true },
    { icon: "🏆", title: "Champion", desc: "Win 50 games", unlocked: false },
    { icon: "👑", title: "Legend", desc: "Reach level 10", unlocked: false },
    { icon: "💎", title: "Collector", desc: "Unlock all games", unlocked: false },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Player Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Level and XP */}
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level {level}</h3>
                  <p className="text-sm text-muted-foreground">Retro Gamer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{xp}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Level {level + 1}</span>
                <span className="font-semibold">
                  {xp} / {xpForNextLevel} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl text-center">
              <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-xs text-muted-foreground">Games Played</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <Star className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">23</div>
              <div className="text-xs text-muted-foreground">Games Unlocked</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`glass-card p-4 rounded-xl ${
                    achievement.unlocked ? "" : "opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
