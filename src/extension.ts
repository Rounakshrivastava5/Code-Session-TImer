import * as vscode from 'vscode';
import { COMMANDS, BREAK_INTERVAL_MS } from './constants';
import { SessionTimer } from './timer/SessionTimer';
import { StatusBarManager } from './ui/StatusBarManager';
import { HistoryWebview } from './ui/HistoryWebview';
import { ActivityTracker } from './services/ActivityTracker';
import { BreakReminder } from './notifications/BreakReminder';
import { SessionStore } from './storage/SessionStore';
import { StorageManager } from './storage/StorageManager';
import { StatisticsService } from './services/StatisticsService';
import { SessionManager } from './services/SessionManager';

let sessionManager: SessionManager | undefined;

export function activate(context: vscode.ExtensionContext): void {
  console.log('[Code Session Timer] Activating...');

  const storageManager = new StorageManager(context.globalState);
  const sessionStore = new SessionStore(storageManager);
  const statsService = new StatisticsService();

  const statusBar = new StatusBarManager();
  const historyWebview = new HistoryWebview();

  const timer = new SessionTimer();
  const tracker = new ActivityTracker();
  const reminder = new BreakReminder(BREAK_INTERVAL_MS);

  sessionManager = new SessionManager(
    timer,
    statusBar,
    tracker,
    reminder,
    sessionStore,
    statsService
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.SHOW_HISTORY, async () => {
      const stats = await sessionStore.getAllDailyStats();
      historyWebview.show(stats);
    })
  );

  sessionManager.startSession();

  context.subscriptions.push(statusBar, timer, tracker, reminder, sessionManager);

  console.log('[Code Session Timer] Activated successfully.');
}

export function deactivate(): void {
  console.log('[Code Session Timer] Deactivating...');
  sessionManager?.endSession();
}
