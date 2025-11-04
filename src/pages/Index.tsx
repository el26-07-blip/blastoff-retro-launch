import { useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { GameModal } from "@/components/GameModal";
import { UserProfile } from "@/components/UserProfile";
import { Input } from "@/components/ui/input";
import { games, categories, Game } from "@/data/games";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userLevel] = useState(5);
  const [userXP] = useState(3450);

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20">
      <Header userLevel={userLevel} userXP={userXP} onProfileClick={() => setShowProfile(true)} />

      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 gradient-text animate-float">
            100+ Retro Games
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the golden age of gaming with our collection of classic arcade games,
            reimagined with stunning glassmorphic design.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-6 mb-8 animate-scale-in">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass-card border-border/50 h-12 text-lg"
            />
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <GameCard {...game} onClick={() => setSelectedGame(game)} />
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">No games found</p>
            <p className="text-muted-foreground mt-2">Try a different search or category</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <GameModal
        game={selectedGame}
        open={!!selectedGame}
        onClose={() => setSelectedGame(null)}
      />
      <UserProfile
        open={showProfile}
        onClose={() => setShowProfile(false)}
        level={userLevel}
        xp={userXP}
      />
    </div>
  );
};

export default Index;
