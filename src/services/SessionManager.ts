import * as vscode from 'vscode';
import { SessionTimer } from '../timer/SessionTimer';
import { StatusBarManager } from '../ui/StatusBarManager';
import { ActivityTracker } from './ActivityTracker';
import { BreakReminder } from '../notifications/BreakReminder';
import { SessionStore } from '../storage/SessionStore';
import { StatisticsService } from './StatisticsService';
import { getTodayDateKey, mergeActivityData } from '../utils';
import { ActivityData } from '../models';

export class SessionManager {
  private _timer: SessionTimer;
  private _statusBar: StatusBarManager;
  private _tracker: ActivityTracker;
  private _reminder: BreakReminder;
  private _store: SessionStore;
  private _statsService: StatisticsService;
  private _sessionActivity: ActivityData = {
    filesOpened: [],
    filesEdited: [],
    saveCount: 0,
    linesAdded: 0,
    linesRemoved: 0,
  };

  private _focusListener: vscode.Disposable | null = null;

  constructor(
    timer: SessionTimer,
    statusBar: StatusBarManager,
    tracker: ActivityTracker,
    reminder: BreakReminder,
    store: SessionStore,
    statsService: StatisticsService
  ) {
    this._timer = timer;
    this._statusBar = statusBar;
    this._tracker = tracker;
    this._reminder = reminder;
    this._store = store;
    this._statsService = statsService;
  }

  async startSession(): Promise<void> {
    this._statusBar.show();
    this._tracker.start();

    const savedSession = await this._store.loadCurrentSession();
    if (savedSession) {
      this._sessionActivity = savedSession.activity;
      this._timer.restore(savedSession.elapsedSeconds, savedSession.isPaused);
    } else {
      this._timer.start();
    }

    this._timer.onTick.add((seconds) => {
      this._statusBar.updateDisplay(seconds);
    });

    this._reminder.start(() => {});

    this._focusListener = vscode.window.onDidChangeWindowState((state) => {
      if (state.focused) {
        this.resumeSession();
      } else {
        this.pauseSession();
      }
    });
  }

  pauseSession(): void {
    this._timer.pause();
  }

  resumeSession(): void {
    this._timer.resume();
  }

  async endSession(): Promise<void> {
    this._timer.stop();
    this._tracker.dispose();
    this._reminder.stop();
    this._focusListener?.dispose();

    const sessionActivity = this._tracker.getActivity();
    const mergedActivity = mergeActivityData(this._sessionActivity, sessionActivity);
    const todayKey = getTodayDateKey();
    const existingStats = await this._store.getDailyStats(todayKey);
    const elapsed = this._timer.elapsedSeconds;

    const dailyStats = this._statsService.computeDailyStats(existingStats, elapsed, mergedActivity);
    await this._store.saveDailyStats(todayKey, dailyStats);
    await this._store.clearCurrentSession();
  }

  dispose(): void {
    this._timer.dispose();
    this._statusBar.dispose();
    this._tracker.dispose();
    this._reminder.dispose();
    this._focusListener?.dispose();
  }
}
