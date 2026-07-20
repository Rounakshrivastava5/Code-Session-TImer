import * as vscode from 'vscode';
import { ActivityData } from '../models';

export class ActivityTracker {
  private _filesOpened = new Set<string>();
  private _filesEdited = new Set<string>();
  private _saveCount = 0;
  private _linesAdded = 0;
  private _linesRemoved = 0;

  private _openListener: vscode.Disposable | null = null;
  private _changeListener: vscode.Disposable | null = null;
  private _saveListener: vscode.Disposable | null = null;

  start(): void {
    this._openListener = vscode.workspace.onDidOpenTextDocument((doc) => {
      if (!doc.uri.scheme.startsWith('file')) return;
      this._filesOpened.add(doc.uri.fsPath);
    });

    this._saveListener = vscode.workspace.onDidSaveTextDocument((doc) => {
      if (!doc.uri.scheme.startsWith('file')) return;
      this._saveCount++;
    });

    this._changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
      if (!event.document.uri.scheme.startsWith('file')) return;

      this._filesEdited.add(event.document.uri.fsPath);

      for (const change of event.contentChanges) {
        if (change.rangeLength > 0) {
          this._linesRemoved += change.text.split('\n').length - 1;
        }
        if (change.text.length > 0) {
          this._linesAdded += change.text.split('\n').length - 1;
        }
      }
    });
  }

  getActivity(): ActivityData {
    return {
      filesOpened: Array.from(this._filesOpened),
      filesEdited: Array.from(this._filesEdited),
      saveCount: this._saveCount,
      linesAdded: this._linesAdded,
      linesRemoved: this._linesRemoved,
    };
  }

  reset(): void {
    this._filesOpened.clear();
    this._filesEdited.clear();
    this._saveCount = 0;
    this._linesAdded = 0;
    this._linesRemoved = 0;
  }

  dispose(): void {
    this._openListener?.dispose();
    this._changeListener?.dispose();
    this._saveListener?.dispose();
    this.reset();
  }
}
