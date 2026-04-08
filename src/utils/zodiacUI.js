// Zodiac sign symbols and colors
export const zodiacData = {
  'Aries': { symbol: '♈', color: '#ff6b6b', emoji: '🐏' },
  'Taurus': { symbol: '♉', color: '#ffa94d', emoji: '🐂' },
  'Gemini': { symbol: '♊', color: '#ffd43b', emoji: '👯' },
  'Cancer': { symbol: '♋', color: '#a9e34b', emoji: '🦀' },
  'Leo': { symbol: '♌', color: '#ffd43b', emoji: '🦁' },
  'Virgo': { symbol: '♍', color: '#74c0fc', emoji: '👧' },
  'Libra': { symbol: '♎', color: '#b197fc', emoji: '⚖️' },
  'Scorpio': { symbol: '♏', color: '#ff8787', emoji: '🦂' },
  'Sagittarius': { symbol: '♐', color: '#ffa94d', emoji: '🏹' },
  'Capricorn': { symbol: '♑', color: '#748ffc', emoji: '🐐' },
  'Aquarius': { symbol: '♒', color: '#5c7cfa', emoji: '💼' },
  'Pisces': { symbol: '♓', color: '#339af0', emoji: '🐠' }
};

export function getZodiacSymbol(sign) {
  return zodiacData[sign]?.symbol || '✨';
}

export function getZodiacColor(sign) {
  return zodiacData[sign]?.color || '#9f7aea';
}

export function getZodiacEmoji(sign) {
  return zodiacData[sign]?.emoji || '✨';
}
