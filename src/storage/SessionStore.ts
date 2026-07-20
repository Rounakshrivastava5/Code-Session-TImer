import { DailyStats, Session } from '../models';
import { STORAGE_KEYS } from '../constants';
import { StorageManager } from './StorageManager';

export class SessionStore {
  constructor(private _storage: StorageManager) {}

  async saveDailyStats(dateKey: string, stats: DailyStats): Promise<void> {
    const allStats = await this.getAllDailyStats();
    const index = allStats.findIndex((s) => s.date === dateKey);

    if (index !== -1) {
      allStats[index] = stats;
    } else {
      allStats.push(stats);
    }

    await this._storage.set(STORAGE_KEYS.DAILY_STATS, allStats);
  }

  async getDailyStats(dateKey: string): Promise<DailyStats | undefined> {
    const allStats = await this.getAllDailyStats();
    return allStats.find((s) => s.date === dateKey);
  }

  async getAllDailyStats(): Promise<DailyStats[]> {
    const raw = this._storage.get<DailyStats[]>(STORAGE_KEYS.DAILY_STATS);
    return raw ?? [];
  }

  async saveCurrentSession(session: Session): Promise<void> {
    await this._storage.set(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  async loadCurrentSession(): Promise<Session | undefined> {
    return this._storage.get<Session>(STORAGE_KEYS.CURRENT_SESSION);
  }

  async clearCurrentSession(): Promise<void> {
    await this._storage.delete(STORAGE_KEYS.CURRENT_SESSION);
  }
}
