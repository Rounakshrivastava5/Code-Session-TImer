type EventHandler<T> = (data: T) => void;

export class EventDispatcher<T> {
  private _handlers: Array<EventHandler<T>> = [];

  add(handler: EventHandler<T>): void {
    this._handlers.push(handler);
  }

  remove(handler: EventHandler<T>): void {
    const index = this._handlers.indexOf(handler);
    if (index !== -1) {
      this._handlers.splice(index, 1);
    }
  }

  dispatch(data: T): void {
    for (const handler of this._handlers) {
      handler(data);
    }
  }

  clear(): void {
    this._handlers = [];
  }
}
