export const formatTime = (seconds: number): string =>
  [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');
