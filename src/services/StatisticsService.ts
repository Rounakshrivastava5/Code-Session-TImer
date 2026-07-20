import { DailyStats, ActivityData } from '../models';

export class StatisticsService {
  computeDailyStats(
    existing: DailyStats | undefined,
    elapsedSeconds: number,
    sessionActivity: ActivityData
  ): DailyStats {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    return {
      date: dateKey,
      totalElapsedSeconds: (existing?.totalElapsedSeconds ?? 0) + elapsedSeconds,
      sessionCount: (existing?.sessionCount ?? 0) + 1,
      filesOpened: Math.max(existing?.filesOpened ?? 0, sessionActivity.filesOpened.length),
      filesEdited: Math.max(existing?.filesEdited ?? 0, sessionActivity.filesEdited.length),
      saveCount: (existing?.saveCount ?? 0) + sessionActivity.saveCount,
      linesAdded: (existing?.linesAdded ?? 0) + sessionActivity.linesAdded,
      linesRemoved: (existing?.linesRemoved ?? 0) + sessionActivity.linesRemoved,
      breaksTaken: existing?.breaksTaken ?? 0,
    };
  }
}
