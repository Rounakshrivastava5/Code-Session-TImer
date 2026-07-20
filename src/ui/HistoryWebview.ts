import * as vscode from 'vscode';
import { DailyStats } from '../models';
import { formatTime } from '../utils';

export class HistoryWebview {
  private _panel: vscode.WebviewPanel | null = null;

  show(stats: DailyStats[]): void {
    if (this._panel) {
      this._panel.reveal();
      return;
    }

    this._panel = vscode.window.createWebviewPanel(
      'sessionTimerHistory',
      'Session History',
      vscode.ViewColumn.One,
      { enableScripts: false }
    );

    this._panel.webview.html = this._renderHtml(stats);

    this._panel.onDidDispose(() => {
      this._panel = null;
    });
  }

  private _renderHtml(stats: DailyStats[]): string {
    const rows = stats
      .map(
        (s) => `
      <tr>
        <td>${s.date}</td>
        <td>${formatTime(s.totalElapsedSeconds)}</td>
        <td>${s.sessionCount}</td>
        <td>${s.filesOpened}</td>
        <td>${s.filesEdited}</td>
        <td>${s.saveCount}</td>
        <td>${s.linesAdded}</td>
        <td>${s.linesRemoved}</td>
        <td>${s.breaksTaken}</td>
      </tr>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session History</title>
  <style>
    body { font-family: var(--vscode-font-family); padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--vscode-panel-border); }
    th { font-weight: 600; }
  </style>
</head>
<body>
  <h2>Daily Session History</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Sessions</th>
        <th>Opened</th>
        <th>Edited</th>
        <th>Saves</th>
        <th>+Lines</th>
        <th>-Lines</th>
        <th>Breaks</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="9" style="text-align:center;padding:24px;">No sessions recorded yet.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
  }

  dispose(): void {
    this._panel?.dispose();
    this._panel = null;
  }
}
