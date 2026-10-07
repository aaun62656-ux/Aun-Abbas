export type GameType = 
  | 'home'
  | 'number_matching'
  | 'alphabet_learning'
  | 'memory_card'
  | 'simple_puzzle'
  | 'counting_game'
  | 'parent_zone';

export interface GameStats {
  numberMatchingStars: number;
  alphabetLearningStars: number;
  memoryCardStars: number;
  simplePuzzleStars: number;
  countingGameStars: number;
  totalGamesPlayed: number;
  minutesPlayed: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  speechEnabled: boolean;
  screenTimeLimitMinutes: number; // 0 for unlimited, 15, 30, 45, 60
  hapticsEnabled: boolean;
}

export interface GameInfo {
  id: GameType;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  starsKey: keyof GameStats;
}
