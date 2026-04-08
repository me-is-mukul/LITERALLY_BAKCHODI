// Calculate zodiac sign from birthdate
export function getZodiacSign(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const zodiacSigns = [
    { name: 'Capricorn', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', start: [6, 21], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    let inRange = false;
    if (startMonth === endMonth) {
      inRange = month === startMonth && day >= startDay && day <= endDay;
    } else if (startMonth > endMonth) {
      inRange = (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
    } else {
      inRange = (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
    }

    if (inRange) return sign.name;
  }

  return 'Capricorn'; // fallback
}

// Get personality hints for a zodiac sign
export function getHints(zodiacSign) {
  const hints = {
    'Aries': ['Courageous', 'Passionate', 'Impulsive', 'Leadership'],
    'Taurus': ['Reliable', 'Stubborn', 'Practical', 'Sensual'],
    'Gemini': ['Adaptable', 'Intellectual', 'Curious', 'Communicative'],
    'Cancer': ['Emotional', 'Protective', 'Intuitive', 'Loyal'],
    'Leo': ['Confident', 'Creative', 'Generous', 'Dramatic'],
    'Virgo': ['Analytical', 'Practical', 'Perfectionistic', 'Detail-oriented'],
    'Libra': ['Diplomatic', 'Fair-minded', 'Artistic', 'Social'],
    'Scorpio': ['Secretive', 'Powerful', 'Intense', 'Mysterious'],
    'Sagittarius': ['Optimistic', 'Adventure-loving', 'Philosophical', 'Honest'],
    'Capricorn': ['Disciplined', 'Responsible', 'Ambitious', 'Self-controlled'],
    'Aquarius': ['Independent', 'Intellectual', 'Humanitarian', 'Eccentric'],
    'Pisces': ['Artistic', 'Gentle', 'Wise', 'Compassionate']
  };

  return hints[zodiacSign] || [];
}

// Get all zodiac signs for display
export function getAllZodiacSigns() {
  return [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
}
