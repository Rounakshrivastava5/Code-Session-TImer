import * as vscode from 'vscode';

export type BreakReminderCallback = () => void;

export class BreakReminder {
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _lastBreakTimeSeconds = 0;
  private _breakIntervalSeconds: number;
  private _onBreakDue: BreakReminderCallback | null = null;

  constructor(breakIntervalMs: number) {
    this._breakIntervalSeconds = breakIntervalMs / 1000;
  }

  start(onBreakDue: BreakReminderCallback): void {
    this._onBreakDue = onBreakDue;

    this._intervalId = setInterval(() => {
      vscode.window
        .showInformationMessage('Time to take a break! Step away for 5 minutes.', 'Snooze 5 min')
        .then((action) => {
          if (action === 'Snooze 5 min') {
            this._lastBreakTimeSeconds -= 5 * 60;
          }
        });

      this._onBreakDue?.();
    }, this._breakIntervalSeconds * 1000);
  }

  updateElapsed(activeSeconds: number): void {
    if (activeSeconds - this._lastBreakTimeSeconds >= this._breakIntervalSeconds) {
      this._lastBreakTimeSeconds = activeSeconds;
    }
  }

  stop(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._onBreakDue = null;
  }

  dispose(): void {
    this.stop();
  }
}
