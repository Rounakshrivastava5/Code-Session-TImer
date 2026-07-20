export interface ActivityData {
  filesOpened: string[];
  filesEdited: string[];
  saveCount: number;
  linesAdded: number;
  linesRemoved: number;
}

export interface Session {
  startTime: number;
  elapsedSeconds: number;
  isPaused: boolean;
  activity: ActivityData;
}

export interface DailyStats {
  date: string;
  totalElapsedSeconds: number;
  sessionCount: number;
  filesOpened: number;
  filesEdited: number;
  saveCount: number;
  linesAdded: number;
  linesRemoved: number;
  breaksTaken: number;
}
