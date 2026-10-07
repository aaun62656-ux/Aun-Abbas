import { AppSettings, GameStats } from '../types';

const STATS_KEY = 'kids_fun_games_stats';
const SETTINGS_KEY = 'kids_fun_games_settings';
const SESSION_START_KEY = 'kids_fun_games_session_start';

export const initialStats: GameStats = {
  numberMatchingStars: 0,
  alphabetLearningStars: 0,
  memoryCardStars: 0,
  simplePuzzleStars: 0,
  countingGameStars: 0,
  totalGamesPlayed: 0,
  minutesPlayed: 0,
};

export const initialSettings: AppSettings = {
  soundEnabled: true,
  speechEnabled: true,
  screenTimeLimitMinutes: 0, // 0 = unlimited
  hapticsEnabled: true,
};

export function loadStats(): GameStats {
  if (typeof window === 'undefined') return initialStats;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return initialStats;
    const parsed = JSON.parse(raw);
    return { ...initialStats, ...parsed };
  } catch {
    return initialStats;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

export function addStars(gameKey: keyof GameStats, count: number): GameStats {
  const current = loadStats();
  const updated: GameStats = {
    ...current,
    [gameKey]: ((current[gameKey] as number) || 0) + count,
    totalGamesPlayed: current.totalGamesPlayed + 1,
  };
  saveStats(updated);
  return updated;
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return initialSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return initialSettings;
    return { ...initialSettings, ...JSON.parse(raw) };
  } catch {
    return initialSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function resetAllProgress(): GameStats {
  saveStats(initialStats);
  return initialStats;
}

export function getSessionDurationMinutes(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const startStr = sessionStorage.getItem(SESSION_START_KEY);
    if (!startStr) {
      sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
      return 0;
    }
    const start = parseInt(startStr, 10);
    const diffMs = Date.now() - start;
    return Math.floor(diffMs / 60000);
  } catch {
    return 0;
  }
}
