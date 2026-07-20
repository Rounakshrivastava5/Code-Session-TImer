export const BREAK_INTERVAL_MS = 30 * 60 * 1000;

export const TIMER_TICK_MS = 1000;

export const STATUS_BAR_PRIORITY = 100;

export const STORAGE_KEYS = {
  DAILY_STATS: 'codeSessionTimer.dailyStats',
  CURRENT_SESSION: 'codeSessionTimer.currentSession',
} as const;

export const COMMANDS = {
  SHOW_HISTORY: 'codeSessionTimer.showHistory',
} as const;
