function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toLocaleString('ar-EG');
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} يوم`;
  if (hours > 0) return `${hours % 24} ساعة`;
  if (minutes > 0) return `${minutes % 60} دقيقة`;
  return `${seconds % 60} ثانية`;
}

function cooldownRemaining(lastTime, cooldownMs) {
  const remaining = lastTime + cooldownMs - Date.now();
  return remaining > 0 ? remaining : 0;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseTime(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  const val = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return val * multipliers[unit];
}

module.exports = {
  randomInt,
  formatNumber,
  formatDuration,
  cooldownRemaining,
  shuffle,
  parseTime,
};
