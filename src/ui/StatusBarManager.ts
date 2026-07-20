import * as vscode from 'vscode';
import { formatTime } from '../utils';
import { STATUS_BAR_PRIORITY, COMMANDS } from '../constants';

export class StatusBarManager {
  private _item: vscode.StatusBarItem;

  constructor() {
    this._item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      STATUS_BAR_PRIORITY
    );
    this._item.text = '$(watch) 00:00';
    this._item.tooltip = 'Code Session Timer — Click to view history';
    this._item.command = COMMANDS.SHOW_HISTORY;
  }

  updateDisplay(seconds: number): void {
    this._item.text = `$(watch) ${formatTime(seconds)}`;
  }

  show(): void {
    this._item.show();
  }

  hide(): void {
    this._item.hide();
  }

  dispose(): void {
    this._item.dispose();
  }
}
