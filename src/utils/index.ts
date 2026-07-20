export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');

  if (h > 0) {
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function mergeActivityData(
  current: import('../models').ActivityData,
  incoming: Partial<import('../models').ActivityData>
): import('../models').ActivityData {
  return {
    filesOpened: [...new Set([...current.filesOpened, ...(incoming.filesOpened ?? [])])],
    filesEdited: [...new Set([...current.filesEdited, ...(incoming.filesEdited ?? [])])],
    saveCount: current.saveCount + (incoming.saveCount ?? 0),
    linesAdded: current.linesAdded + (incoming.linesAdded ?? 0),
    linesRemoved: current.linesRemoved + (incoming.linesRemoved ?? 0),
  };
}
