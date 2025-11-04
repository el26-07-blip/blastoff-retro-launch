export interface Game {
  id: string;
  title: string;
  category: string;
  icon: string;
  level: number;
  unlocked: boolean;
  rating: number;
  plays: number;
  playable: boolean;
  description: string;
}

export const games: Game[] = [
  // Arcade Games
  { id: "snake", title: "Snake Classic", category: "Arcade", icon: "🐍", level: 1, unlocked: true, rating: 4.8, plays: 152340, playable: true, description: "Classic snake game with modern twist" },
  { id: "pong", title: "Pong Battle", category: "Arcade", icon: "🏓", level: 1, unlocked: true, rating: 4.5, plays: 98234, playable: true, description: "The legendary paddle game" },
  { id: "breakout", title: "Brick Breaker", category: "Arcade", icon: "🧱", level: 2, unlocked: true, rating: 4.7, plays: 134567, playable: true, description: "Break all the bricks!" },
  { id: "space", title: "Space Invaders", category: "Arcade", icon: "👾", level: 2, unlocked: true, rating: 4.9, plays: 187654, playable: false, description: "Defend Earth from aliens" },
  { id: "pacman", title: "Pac-Maze", category: "Arcade", icon: "👻", level: 3, unlocked: true, rating: 4.9, plays: 234567, playable: false, description: "Eat dots, avoid ghosts" },
  { id: "asteroids", title: "Asteroids", category: "Arcade", icon: "☄️", level: 3, unlocked: true, rating: 4.6, plays: 145678, playable: false, description: "Destroy space rocks" },
  { id: "galaga", title: "Galaxy War", category: "Arcade", icon: "🚀", level: 4, unlocked: true, rating: 4.8, plays: 167890, playable: false, description: "Epic space shooter" },
  { id: "digdug", title: "Dig Master", category: "Arcade", icon: "⛏️", level: 4, unlocked: false, rating: 4.4, plays: 98765, playable: false, description: "Dig and defeat monsters" },
  
  // Puzzle Games
  { id: "tetris", title: "Block Fall", category: "Puzzle", icon: "🎮", level: 1, unlocked: true, rating: 4.9, plays: 345678, playable: false, description: "Classic block puzzle" },
  { id: "2048", title: "2048 Pro", category: "Puzzle", icon: "🔢", level: 1, unlocked: true, rating: 4.7, plays: 234567, playable: false, description: "Merge to 2048" },
  { id: "minesweeper", title: "Mine Hunter", category: "Puzzle", icon: "💣", level: 2, unlocked: true, rating: 4.5, plays: 156789, playable: false, description: "Find all the mines" },
  { id: "sudoku", title: "Sudoku Master", category: "Puzzle", icon: "🧩", level: 2, unlocked: true, rating: 4.6, plays: 198765, playable: false, description: "Number puzzle challenge" },
  { id: "rubik", title: "Cube Solver", category: "Puzzle", icon: "🎲", level: 3, unlocked: true, rating: 4.3, plays: 87654, playable: false, description: "Virtual Rubik's cube" },
  { id: "mahjong", title: "Tile Match", category: "Puzzle", icon: "🀄", level: 3, unlocked: false, rating: 4.5, plays: 123456, playable: false, description: "Match ancient tiles" },
  { id: "sokoban", title: "Box Pusher", category: "Puzzle", icon: "📦", level: 4, unlocked: false, rating: 4.4, plays: 76543, playable: false, description: "Push boxes to targets" },
  { id: "crossword", title: "Word Cross", category: "Puzzle", icon: "📝", level: 4, unlocked: false, rating: 4.6, plays: 145678, playable: false, description: "Crossword puzzles" },

  // Adventure Games  
  { id: "zelda", title: "Legend Quest", category: "Adventure", icon: "⚔️", level: 5, unlocked: true, rating: 4.9, plays: 456789, playable: false, description: "Epic adventure awaits" },
  { id: "mario", title: "Platform Hero", category: "Adventure", icon: "🍄", level: 5, unlocked: true, rating: 4.9, plays: 567890, playable: false, description: "Jump and run adventure" },
  { id: "sonic", title: "Speed Runner", category: "Adventure", icon: "💨", level: 6, unlocked: false, rating: 4.8, plays: 345678, playable: false, description: "Gotta go fast!" },
  { id: "metroid", title: "Space Explorer", category: "Adventure", icon: "🛸", level: 6, unlocked: false, rating: 4.7, plays: 234567, playable: false, description: "Explore alien worlds" },
  { id: "castlevania", title: "Castle Quest", category: "Adventure", icon: "🧛", level: 7, unlocked: false, rating: 4.6, plays: 187654, playable: false, description: "Defeat the vampire lord" },
  { id: "megaman", title: "Robo Fighter", category: "Adventure", icon: "🤖", level: 7, unlocked: false, rating: 4.7, plays: 198765, playable: false, description: "Robot battle action" },

  // Sports Games
  { id: "tennis", title: "Court Champion", category: "Sports", icon: "🎾", level: 3, unlocked: true, rating: 4.5, plays: 134567, playable: false, description: "Tennis simulation" },
  { id: "basketball", title: "Hoop Dreams", category: "Sports", icon: "🏀", level: 3, unlocked: true, rating: 4.6, plays: 156789, playable: false, description: "Shoot some hoops" },
  { id: "soccer", title: "Goal Master", category: "Sports", icon: "⚽", level: 4, unlocked: true, rating: 4.7, plays: 298765, playable: false, description: "Score amazing goals" },
  { id: "bowling", title: "Strike King", category: "Sports", icon: "🎳", level: 4, unlocked: false, rating: 4.4, plays: 112345, playable: false, description: "Bowl perfect games" },
  { id: "golf", title: "Mini Golf Pro", category: "Sports", icon: "⛳", level: 5, unlocked: false, rating: 4.5, plays: 98765, playable: false, description: "Hole in one challenge" },
  { id: "baseball", title: "Home Run Hero", category: "Sports", icon: "⚾", level: 5, unlocked: false, rating: 4.6, plays: 145678, playable: false, description: "Hit it out of the park" },

  // Racing Games
  { id: "racing1", title: "Speed Racer", category: "Racing", icon: "🏎️", level: 4, unlocked: true, rating: 4.8, plays: 245678, playable: false, description: "High-speed racing action" },
  { id: "racing2", title: "Drift Master", category: "Racing", icon: "🏁", level: 4, unlocked: true, rating: 4.7, plays: 198765, playable: false, description: "Master the drift" },
  { id: "racing3", title: "Kart Racing", category: "Racing", icon: "🛞", level: 5, unlocked: false, rating: 4.8, plays: 287654, playable: false, description: "Kart racing fun" },
  { id: "racing4", title: "Moto GP", category: "Racing", icon: "🏍️", level: 5, unlocked: false, rating: 4.6, plays: 167890, playable: false, description: "Motorcycle racing" },
  { id: "racing5", title: "Rally Challenge", category: "Racing", icon: "🚗", level: 6, unlocked: false, rating: 4.7, plays: 145678, playable: false, description: "Off-road racing" },

  // Fighting Games
  { id: "fight1", title: "Street Brawl", category: "Fighting", icon: "🥊", level: 6, unlocked: false, rating: 4.8, plays: 234567, playable: false, description: "Classic fighting action" },
  { id: "fight2", title: "Ninja Combat", category: "Fighting", icon: "🥷", level: 6, unlocked: false, rating: 4.7, plays: 198765, playable: false, description: "Martial arts mastery" },
  { id: "fight3", title: "Monster Clash", category: "Fighting", icon: "🦖", level: 7, unlocked: false, rating: 4.6, plays: 176543, playable: false, description: "Giant monster battles" },
  { id: "fight4", title: "Samurai Duel", category: "Fighting", icon: "⚔️", level: 7, unlocked: false, rating: 4.9, plays: 187654, playable: false, description: "Honor and steel" },

  // Strategy Games
  { id: "chess", title: "Chess Master", category: "Strategy", icon: "♟️", level: 5, unlocked: true, rating: 4.7, plays: 198765, playable: false, description: "Classic chess battles" },
  { id: "checkers", title: "Checkers Pro", category: "Strategy", icon: "🔴", level: 5, unlocked: true, rating: 4.5, plays: 134567, playable: false, description: "Strategic board game" },
  { id: "tower", title: "Tower Defense", category: "Strategy", icon: "🗼", level: 6, unlocked: false, rating: 4.8, plays: 245678, playable: false, description: "Defend your base" },
  { id: "war", title: "Battle Commander", category: "Strategy", icon: "⚔️", level: 6, unlocked: false, rating: 4.6, plays: 167890, playable: false, description: "Lead your army" },
  { id: "civilization", title: "Empire Builder", category: "Strategy", icon: "🏛️", level: 7, unlocked: false, rating: 4.9, plays: 198765, playable: false, description: "Build a civilization" },

  // Shooter Games
  { id: "duck", title: "Duck Hunt", category: "Shooter", icon: "🦆", level: 3, unlocked: true, rating: 4.7, plays: 234567, playable: false, description: "Classic duck shooting" },
  { id: "zombies", title: "Zombie Shooter", category: "Shooter", icon: "🧟", level: 4, unlocked: true, rating: 4.8, plays: 298765, playable: false, description: "Survive the horde" },
  { id: "laser", title: "Laser Strike", category: "Shooter", icon: "⚡", level: 5, unlocked: false, rating: 4.6, plays: 187654, playable: false, description: "Precision shooting" },
  { id: "cannon", title: "Cannon Blaster", category: "Shooter", icon: "💣", level: 5, unlocked: false, rating: 4.5, plays: 145678, playable: false, description: "Artillery action" },

  // Card Games
  { id: "poker", title: "Poker Night", category: "Card", icon: "🃏", level: 4, unlocked: true, rating: 4.6, plays: 176543, playable: false, description: "Texas Hold'em" },
  { id: "blackjack", title: "21 Blackjack", category: "Card", icon: "🎴", level: 4, unlocked: true, rating: 4.5, plays: 154321, playable: false, description: "Beat the dealer" },
  { id: "solitaire", title: "Solitaire Gold", category: "Card", icon: "♠️", level: 3, unlocked: true, rating: 4.7, plays: 287654, playable: false, description: "Classic solitaire" },
  { id: "uno", title: "Uno Master", category: "Card", icon: "🎯", level: 5, unlocked: false, rating: 4.8, plays: 245678, playable: false, description: "Family card game" },

  // Platformer Games
  { id: "platform1", title: "Jump Quest", category: "Platformer", icon: "🦘", level: 2, unlocked: true, rating: 4.6, plays: 187654, playable: false, description: "Precision platforming" },
  { id: "platform2", title: "Pixel Runner", category: "Platformer", icon: "🏃", level: 3, unlocked: true, rating: 4.7, plays: 198765, playable: false, description: "Endless running fun" },
  { id: "platform3", title: "Cave Explorer", category: "Platformer", icon: "⛰️", level: 4, unlocked: false, rating: 4.5, plays: 134567, playable: false, description: "Explore deep caves" },
  { id: "platform4", title: "Sky Jumper", category: "Platformer", icon: "☁️", level: 4, unlocked: false, rating: 4.8, plays: 176543, playable: false, description: "Jump through clouds" },

  // Rhythm Games
  { id: "rhythm1", title: "Beat Master", category: "Rhythm", icon: "🎵", level: 5, unlocked: false, rating: 4.9, plays: 298765, playable: false, description: "Match the rhythm" },
  { id: "rhythm2", title: "Dance Dance", category: "Rhythm", icon: "💃", level: 6, unlocked: false, rating: 4.8, plays: 245678, playable: false, description: "Dance to the beat" },
  { id: "rhythm3", title: "Guitar Hero", category: "Rhythm", icon: "🎸", level: 6, unlocked: false, rating: 4.9, plays: 287654, playable: false, description: "Rock out with guitar" },
  { id: "rhythm4", title: "Piano Tiles", category: "Rhythm", icon: "🎹", level: 5, unlocked: false, rating: 4.7, plays: 234567, playable: false, description: "Tap the tiles" },

  // Simulation Games
  { id: "sim1", title: "Farm Life", category: "Simulation", icon: "🚜", level: 6, unlocked: false, rating: 4.7, plays: 198765, playable: false, description: "Build your farm" },
  { id: "sim2", title: "City Builder", category: "Simulation", icon: "🏙️", level: 7, unlocked: false, rating: 4.8, plays: 245678, playable: false, description: "Create a metropolis" },
  { id: "sim3", title: "Restaurant Tycoon", category: "Simulation", icon: "🍔", level: 6, unlocked: false, rating: 4.6, plays: 176543, playable: false, description: "Run a restaurant" },
  { id: "sim4", title: "Zoo Manager", category: "Simulation", icon: "🦁", level: 7, unlocked: false, rating: 4.7, plays: 154321, playable: false, description: "Manage a zoo" },

  // Retro Classic Games
  { id: "retro1", title: "Frogger", category: "Classic", icon: "🐸", level: 2, unlocked: true, rating: 4.8, plays: 234567, playable: false, description: "Cross the road safely" },
  { id: "retro2", title: "Q*bert", category: "Classic", icon: "🔶", level: 3, unlocked: true, rating: 4.5, plays: 145678, playable: false, description: "Jump on cubes" },
  { id: "retro3", title: "Donkey Kong", category: "Classic", icon: "🦍", level: 4, unlocked: false, rating: 4.9, plays: 298765, playable: false, description: "Climb to the top" },
  { id: "retro4", title: "Centipede", category: "Classic", icon: "🐛", level: 3, unlocked: true, rating: 4.6, plays: 176543, playable: false, description: "Shoot the centipede" },
  { id: "retro5", title: "Joust", category: "Classic", icon: "🦅", level: 5, unlocked: false, rating: 4.7, plays: 154321, playable: false, description: "Flying bird battles" },

  // Casual Games
  { id: "casual1", title: "Bubble Pop", category: "Casual", icon: "🫧", level: 1, unlocked: true, rating: 4.6, plays: 345678, playable: false, description: "Pop matching bubbles" },
  { id: "casual2", title: "Match 3 Mania", category: "Casual", icon: "💎", level: 1, unlocked: true, rating: 4.7, plays: 398765, playable: false, description: "Match three or more" },
  { id: "casual3", title: "Word Search", category: "Casual", icon: "🔤", level: 2, unlocked: true, rating: 4.5, plays: 234567, playable: false, description: "Find hidden words" },
  { id: "casual4", title: "Color Switch", category: "Casual", icon: "🎨", level: 2, unlocked: true, rating: 4.4, plays: 198765, playable: false, description: "Match the colors" },
  { id: "casual5", title: "Jigsaw Puzzle", category: "Casual", icon: "🧩", level: 3, unlocked: true, rating: 4.8, plays: 287654, playable: false, description: "Complete the picture" },

  // Bonus Games
  { id: "bonus1", title: "Coin Master", category: "Bonus", icon: "💰", level: 8, unlocked: false, rating: 4.7, plays: 234567, playable: false, description: "Collect all coins" },
  { id: "bonus2", title: "Lucky Spin", category: "Bonus", icon: "🎰", level: 8, unlocked: false, rating: 4.6, plays: 198765, playable: false, description: "Spin to win" },
  { id: "bonus3", title: "Treasure Hunt", category: "Bonus", icon: "🗺️", level: 9, unlocked: false, rating: 4.8, plays: 176543, playable: false, description: "Find hidden treasure" },
  { id: "bonus4", title: "Mystery Box", category: "Bonus", icon: "📦", level: 9, unlocked: false, rating: 4.5, plays: 154321, playable: false, description: "Open mystery rewards" },
  { id: "bonus5", title: "Daily Challenge", category: "Bonus", icon: "🎁", level: 10, unlocked: false, rating: 4.9, plays: 298765, playable: false, description: "New challenge daily" },
];

export const categories = ["All", ...Array.from(new Set(games.map((g) => g.category)))];
