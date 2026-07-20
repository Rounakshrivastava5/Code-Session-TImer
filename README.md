<div align="center">
  <br>
  <img src="https://img.icons8.com/fluency/96/clock--v1.png" width="80" alt="logo"/>
  <h1>Code Session Timer</h1>
  <p><strong>A VS Code extension that tracks your coding sessions, measures productivity, and reminds you to take breaks — automatically.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#development">Development</a> •
    <a href="#roadmap">Roadmap</a>
  </p>

  <br>
</div>

---

## Features

| Feature | Description |
|---------|-------------|
| ⏱ **Auto-start Timer** | Begins counting as soon as VS Code opens — zero setup |
| 📊 **Live Status Bar** | See your session time in the status bar, updating every second |
| 📁 **Activity Tracking** | Tracks files opened, files edited, saves, lines added & removed |
| ☕ **Break Reminders** | Notifications every 30 minutes — with snooze option |
| 📈 **Daily Statistics** | Persists session data locally so you can review your productivity over time |
| 🔄 **Auto Pause/Resume** | Timer pauses when you switch away from VS Code, resumes when you return |
| 🖥 **History Webview** | Dedicated panel showing daily stats in a clean table |
| 💾 **Local Storage** | All data stays on your machine — no cloud, no accounts, no tracking |

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for **Code Session Timer**
4. Click **Install**

### From VSIX (manual)

```bash
# Package the extension
npm install -g @vscode/vsce
vsce package

# In VS Code: Ctrl+Shift+P → Extensions: Install from VSIX...
# Select the .vsix file
```

## Usage

Once installed, the extension activates automatically when VS Code starts.

### What you'll see

```
Bottom-left status bar:
$(watch) 00:05:23    ← Live session timer
```

### Commands

| Command | How to run |
|---------|-----------|
| `Session Timer: Show History` | `Ctrl+Shift+P` → type "Session Timer" |

### How it works

1. **Open VS Code** → timer starts, status bar appears
2. **Edit code** → files, saves, and line changes are tracked silently
3. **Alt+Tab away** → timer pauses automatically
4. **Come back** → timer resumes
5. **Every 30 minutes** → break reminder notification
6. **Close VS Code** → session data is saved to local storage
7. **Next day** → open **Show History** to see your previous sessions

## Architecture

```
src/
├── extension.ts              Entry point — wires all components together
├── constants/                App-wide configuration (timings, storage keys, commands)
├── models/                   TypeScript interfaces (Session, DailyStats, ActivityData)
├── timer/
│   └── SessionTimer.ts       Core count-up timer with start/pause/resume/stop + events
├── ui/
│   ├── StatusBarManager.ts   VS Code status bar item (watch icon + formatted time)
│   └── HistoryWebview.ts     Webview panel showing daily stats table
├── storage/
│   ├── StorageManager.ts     Generic wrapper around VS Code's Memento API
│   └── SessionStore.ts       Domain-specific read/write for sessions and stats
├── notifications/
│   └── BreakReminder.ts      30-minute interval break notifications with snooze
├── services/
│   ├── ActivityTracker.ts    Listens to document open/change/save events
│   ├── StatisticsService.ts  Aggregates session data into DailyStats records
│   └── SessionManager.ts     Orchestrator — ties timer, tracker, storage, and UI together
└── utils/
    ├── index.ts              formatTime(), getTodayDateKey(), mergeActivityData()
    └── EventDispatcher.ts    Lightweight typed pub/sub helper
```

### Data Flow

```
Timer tick (1s) → SessionTimer emits 'tick'
  → StatusBarManager.updateDisplay(elapsed)
  → BreakReminder checks if 30min active elapsed

Document event → ActivityTracker updates counters (silent)

Focus loss → SessionManager → SessionTimer.pause()
Focus gain → SessionManager → SessionTimer.resume()

Extension close → SessionManager.endSession()
  → Timer stops, activity snapshot taken
  → DailyStats merged + saved to globalState
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **TypeScript** | Language (strict mode, ES2022) |
| **VS Code API** | Extension host, status bar, webview, storage, notifications |
| **ESBuild** | Bundler (fast builds, CJS output for Node.js host) |
| **VS Code GlobalState** | Persistent local storage (no external backend) |

## Development

```bash
# Clone
git clone https://github.com/your-username/code-session-timer.git
cd code-session-timer

# Install dependencies
npm install

# Build
npm run build

# Watch mode (auto-rebuild on file changes)
npm run watch

# Lint
npm run lint

# Run in VS Code
# Press F5 → Extension Development Host opens
```

### Project Structure

```bash
code-session-timer/
├── .vscode/            # Launch + task config for debugging
├── src/                # All source code
├── dist/               # Compiled output (gitignored)
├── esbuild.config.js   # Build configuration
├── package.json        # Extension manifest + dependencies
└── tsconfig.json       # TypeScript configuration
```

## Roadmap

- [x] Auto-start timer on VS Code open
- [x] Live status bar display
- [x] Activity tracking (files, saves, lines)
- [x] Break reminders (30-min interval)
- [x] Daily statistics persistence
- [x] Auto pause/resume on focus change
- [x] History webview
- [ ] Configurable break interval
- [ ] Pause/Resume manual toggle command
- [ ] Daily goal target (e.g. "code for 4 hours")
- [ ] Charts in webview (weekly trends)
- [ ] Export data as CSV

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © 2024
