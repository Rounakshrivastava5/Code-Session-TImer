import { TIMER_TICK_MS } from '../constants';
import { EventDispatcher } from '../utils/EventDispatcher';

export type TimerState = 'stopped' | 'running' | 'paused';

export interface TimerEvents {
  tick: (elapsedSeconds: number) => void;
  stateChange: (state: TimerState) => void;
}

export class SessionTimer {
  private _elapsedSeconds = 0;
  private _state: TimerState = 'stopped';
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _lastTickTimestamp: number | null = null;

  public readonly onTick = new EventDispatcher<number>();
  public readonly onStateChange = new EventDispatcher<TimerState>();

  get elapsedSeconds(): number {
    return this._elapsedSeconds;
  }

  get state(): TimerState {
    return this._state;
  }

  start(): void {
    if (this._state === 'running') return;

    this._elapsedSeconds = 0;
    this._state = 'running';
    this._beginTicking();
    this.onStateChange.dispatch(this._state);
  }

  pause(): void {
    if (this._state !== 'running') return;

    this._state = 'paused';
    this._stopTicking();
    this.onStateChange.dispatch(this._state);
  }

  resume(): void {
    if (this._state !== 'paused') return;

    this._state = 'running';
    this._beginTicking();
    this.onStateChange.dispatch(this._state);
  }

  stop(): void {
    this._state = 'stopped';
    this._stopTicking();
    this._elapsedSeconds = 0;
    this._lastTickTimestamp = null;
    this.onStateChange.dispatch(this._state);
  }

  restore(elapsedSeconds: number, isPaused: boolean): void {
    this._elapsedSeconds = elapsedSeconds;
    this._state = isPaused ? 'paused' : 'running';
    if (this._state === 'running') {
      this._beginTicking();
    }
    this.onStateChange.dispatch(this._state);
  }

  private _beginTicking(): void {
    this._lastTickTimestamp = Date.now();
    this._intervalId = setInterval(() => {
      this._elapsedSeconds++;
      this.onTick.dispatch(this._elapsedSeconds);
    }, TIMER_TICK_MS);
  }

  private _stopTicking(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._lastTickTimestamp = null;
  }

  dispose(): void {
    this.stop();
    this.onTick.clear();
    this.onStateChange.clear();
  }
}
