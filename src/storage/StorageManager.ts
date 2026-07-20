import { Memento } from 'vscode';

export class StorageManager {
  constructor(private _store: Memento) {}

  get<T>(key: string): T | undefined {
    return this._store.get<T>(key);
  }

  set<T>(key: string, value: T): Thenable<void> {
    return this._store.update(key, value);
  }

  delete(key: string): Thenable<void> {
    return this._store.update(key, undefined);
  }

  keys(): readonly string[] {
    return this._store.keys();
  }
}
