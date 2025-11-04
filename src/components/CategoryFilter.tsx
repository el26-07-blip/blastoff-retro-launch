import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "glass-card px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
            selectedCategory === category
              ? "bg-primary/20 border-primary/50 text-primary neon-glow scale-105"
              : "hover:bg-white/5 text-muted-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
