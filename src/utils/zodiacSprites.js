// Beautiful SVG zodiac sprites inspired by constellations
// Each sprite uses the viewBox "0 0 100 100" for perfect scaling

const zodiacSprites = {
  'Aries': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aries-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff4757;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Ram head -->
    <circle cx="50" cy="50" r="35" fill="url(#aries-grad)" opacity="0.1" stroke="url(#aries-grad)" stroke-width="2"/>
    <!-- Head -->
    <circle cx="50" cy="45" r="12" fill="none" stroke="url(#aries-grad)" stroke-width="2.5"/>
    <!-- Horns -->
    <path d="M 42 38 Q 35 25 38 15" fill="none" stroke="url(#aries-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 58 38 Q 65 25 62 15" fill="none" stroke="url(#aries-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Snout -->
    <circle cx="50" cy="50" r="7" fill="none" stroke="url(#aries-grad)" stroke-width="2"/>
    <!-- Ears -->
    <path d="M 40 40 L 35 35" fill="none" stroke="url(#aries-grad)" stroke-width="2" stroke-linecap="round"/>
    <path d="M 60 40 L 65 35" fill="none" stroke="url(#aries-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Body suggestion -->
    <path d="M 50 57 L 50 75" fill="none" stroke="url(#aries-grad)" stroke-width="2" opacity="0.6"/>
  </svg>`,

  'Taurus': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="taurus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffa94d;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Bull face -->
    <circle cx="50" cy="50" r="35" fill="url(#taurus-grad)" opacity="0.1" stroke="url(#taurus-grad)" stroke-width="2"/>
    <!-- Head -->
    <circle cx="50" cy="48" r="13" fill="none" stroke="url(#taurus-grad)" stroke-width="2.5"/>
    <!-- Horns (curved) -->
    <path d="M 39 42 Q 25 35 20 50" fill="none" stroke="url(#taurus-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 61 42 Q 75 35 80 50" fill="none" stroke="url(#taurus-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="45" cy="46" r="2" fill="url(#taurus-grad)"/>
    <circle cx="55" cy="46" r="2" fill="url(#taurus-grad)"/>
    <!-- Snout -->
    <ellipse cx="50" cy="54" rx="6" ry="4" fill="none" stroke="url(#taurus-grad)" stroke-width="2"/>
    <!-- Mouth -->
    <path d="M 46 56 L 54 56" fill="none" stroke="url(#taurus-grad)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Neck -->
    <path d="M 50 61 L 50 72" fill="none" stroke="url(#taurus-grad)" stroke-width="2" opacity="0.6"/>
  </svg>`,

  'Gemini': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd43b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffcc00;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Twin profiles -->
    <circle cx="50" cy="50" r="35" fill="url(#gemini-grad)" opacity="0.1" stroke="url(#gemini-grad)" stroke-width="2"/>
    <!-- Person 1 (left) -->
    <circle cx="35" cy="40" r="10" fill="none" stroke="url(#gemini-grad)" stroke-width="2.5"/>
    <path d="M 35 50 L 35 65" fill="none" stroke="url(#gemini-grad)" stroke-width="2"/>
    <!-- Person 2 (right) -->
    <circle cx="65" cy="40" r="10" fill="none" stroke="url(#gemini-grad)" stroke-width="2.5"/>
    <path d="M 65 50 L 65 65" fill="none" stroke="url(#gemini-grad)" stroke-width="2"/>
    <!-- Connection line between them -->
    <path d="M 45 40 L 55 40" fill="none" stroke="url(#gemini-grad)" stroke-width="1.5" stroke-dasharray="3,2"/>
    <!-- Arms -->
    <path d="M 35 55 L 28 62" fill="none" stroke="url(#gemini-grad)" stroke-width="1.5" opacity="0.7"/>
    <path d="M 65 55 L 72 62" fill="none" stroke="url(#gemini-grad)" stroke-width="1.5" opacity="0.7"/>
  </svg>`,

  'Cancer': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cancer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#a9e34b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#85c400;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Crab body -->
    <circle cx="50" cy="50" r="35" fill="url(#cancer-grad)" opacity="0.1" stroke="url(#cancer-grad)" stroke-width="2"/>
    <!-- Shell -->
    <circle cx="50" cy="48" r="12" fill="none" stroke="url(#cancer-grad)" stroke-width="2.5"/>
    <!-- Left claw -->
    <path d="M 39 48 L 25 45 M 39 48 L 28 40 M 25 45 L 28 40" fill="none" stroke="url(#cancer-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Right claw -->
    <path d="M 61 48 L 75 45 M 61 48 L 72 40 M 75 45 L 72 40" fill="none" stroke="url(#cancer-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Eyes -->
    <line x1="47" y1="42" x2="45" y2="35" stroke="url(#cancer-grad)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="53" y1="42" x2="55" y2="35" stroke="url(#cancer-grad)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Legs -->
    <path d="M 45 60 L 42 72" fill="none" stroke="url(#cancer-grad)" stroke-width="1.5" opacity="0.6"/>
    <path d="M 55 60 L 58 72" fill="none" stroke="url(#cancer-grad)" stroke-width="1.5" opacity="0.6"/>
  </svg>`,

  'Leo': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd43b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffb300;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Mane circle -->
    <circle cx="50" cy="50" r="35" fill="url(#leo-grad)" opacity="0.2" stroke="url(#leo-grad)" stroke-width="2"/>
    <!-- Outer mane (spiky) -->
    <circle cx="50" cy="50" r="30" fill="none" stroke="url(#leo-grad)" stroke-width="1.5" opacity="0.5"/>
    <!-- Head -->
    <circle cx="50" cy="50" r="14" fill="none" stroke="url(#leo-grad)" stroke-width="2.5"/>
    <!-- Eyes (fierce) -->
    <circle cx="45" cy="47" r="2" fill="url(#leo-grad)"/>
    <circle cx="55" cy="47" r="2" fill="url(#leo-grad)"/>
    <!-- Nose -->
    <path d="M 50 51 L 50 55" fill="none" stroke="url(#leo-grad)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Mouth (fierce grin) -->
    <path d="M 46 57 Q 50 60 54 57" fill="none" stroke="url(#leo-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Mane rays -->
    <line x1="50" y1="18" x2="50" y2="25" stroke="url(#leo-grad)" stroke-width="2" stroke-linecap="round"/>
    <line x1="66" y1="26" x2="71" y2="31" stroke="url(#leo-grad)" stroke-width="2" stroke-linecap="round"/>
    <line x1="34" y1="26" x2="29" y2="31" stroke="url(#leo-grad)" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  'Virgo': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="virgo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#74c0fc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4dabf7;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#virgo-grad)" opacity="0.1" stroke="url(#virgo-grad)" stroke-width="2"/>
    <!-- Head -->
    <circle cx="50" cy="40" r="11" fill="none" stroke="url(#virgo-grad)" stroke-width="2.5"/>
    <!-- Hair (flowing) -->
    <path d="M 42 35 Q 40 25 45 20" fill="none" stroke="url(#virgo-grad)" stroke-width="2" stroke-linecap="round"/>
    <path d="M 58 35 Q 60 25 55 20" fill="none" stroke="url(#virgo-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="46" cy="39" r="1.5" fill="url(#virgo-grad)"/>
    <circle cx="54" cy="39" r="1.5" fill="url(#virgo-grad)"/>
    <!-- Body -->
    <path d="M 50 51 L 50 70" fill="none" stroke="url(#virgo-grad)" stroke-width="2.5"/>
    <!-- Arms -->
    <path d="M 50 55 L 38 62" fill="none" stroke="url(#virgo-grad)" stroke-width="2"/>
    <path d="M 50 55 L 62 62" fill="none" stroke="url(#virgo-grad)" stroke-width="2"/>
  </svg>`,

  'Libra': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="libra-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#b197fc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9775fa;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#libra-grad)" opacity="0.1" stroke="url(#libra-grad)" stroke-width="2"/>
    <!-- Balance beam -->
    <line x1="28" y1="50" x2="72" y2="50" stroke="url(#libra-grad)" stroke-width="2.5"/>
    <!-- Fulcrum (triangle) -->
    <polygon points="50,50 48,60 52,60" fill="url(#libra-grad)" opacity="0.6"/>
    <!-- Left scale -->
    <rect x="32" y="40" width="12" height="8" fill="none" stroke="url(#libra-grad)" stroke-width="2" rx="1"/>
    <!-- Left chain -->
    <line x1="38" y1="40" x2="40" y2="30" stroke="url(#libra-grad)" stroke-width="1.5"/>
    <!-- Right scale -->
    <rect x="56" y="40" width="12" height="8" fill="none" stroke="url(#libra-grad)" stroke-width="2" rx="1"/>
    <!-- Right chain -->
    <line x1="62" y1="40" x2="60" y2="30" stroke="url(#libra-grad)" stroke-width="1.5"/>
    <!-- Decorative balance marks -->
    <circle cx="40" cy="30" r="2" fill="url(#libra-grad)" opacity="0.5"/>
    <circle cx="60" cy="30" r="2" fill="url(#libra-grad)" opacity="0.5"/>
  </svg>`,

  'Scorpio': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scorpio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff8787;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#scorpio-grad)" opacity="0.1" stroke="url(#scorpio-grad)" stroke-width="2"/>
    <!-- Body curve -->
    <path d="M 50 30 Q 48 45 50 60" fill="none" stroke="url(#scorpio-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Tail curl -->
    <path d="M 50 60 Q 55 70 52 78 Q 48 80 50 75" fill="none" stroke="url(#scorpio-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Stinger -->
    <circle cx="50" cy="77" r="1.5" fill="url(#scorpio-grad)"/>
    <!-- Left claw -->
    <path d="M 45 35 L 32 28 M 45 35 L 35 25" fill="none" stroke="url(#scorpio-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Right claw -->
    <path d="M 55 35 L 68 28 M 55 35 L 65 25" fill="none" stroke="url(#scorpio-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Legs -->
    <path d="M 48 50 L 38 55" fill="none" stroke="url(#scorpio-grad)" stroke-width="1.5" opacity="0.6"/>
    <path d="M 52 50 L 62 55" fill="none" stroke="url(#scorpio-grad)" stroke-width="1.5" opacity="0.6"/>
  </svg>`,

  'Sagittarius': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sagittarius-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffa94d;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff9800;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#sagittarius-grad)" opacity="0.1" stroke="url(#sagittarius-grad)" stroke-width="2"/>
    <!-- Archer body -->
    <circle cx="50" cy="45" r="9" fill="none" stroke="url(#sagittarius-grad)" stroke-width="2.5"/>
    <!-- Head -->
    <circle cx="50" cy="35" r="6" fill="none" stroke="url(#sagittarius-grad)" stroke-width="2"/>
    <!-- Bow -->
    <path d="M 45 40 Q 35 45 42 52" fill="none" stroke="url(#sagittarius-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Arrow -->
    <line x1="42" y1="52" x2="25" y2="68" stroke="url(#sagittarius-grad)" stroke-width="2" stroke-linecap="round"/>
    <!-- Arrow head -->
    <polygon points="25,68 22,64 28,66" fill="url(#sagittarius-grad)"/>
    <!-- Legs -->
    <path d="M 48 54 L 45 70" fill="none" stroke="url(#sagittarius-grad)" stroke-width="2" opacity="0.7"/>
    <path d="M 52 54 L 55 70" fill="none" stroke="url(#sagittarius-grad)" stroke-width="2" opacity="0.7"/>
  </svg>`,

  'Capricorn': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="capricorn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#748ffc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#5c7cfa;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#capricorn-grad)" opacity="0.1" stroke="url(#capricorn-grad)" stroke-width="2"/>
    <!-- Front goat head -->
    <circle cx="50" cy="40" r="10" fill="none" stroke="url(#capricorn-grad)" stroke-width="2.5"/>
    <!-- Horns -->
    <path d="M 43 32 Q 35 20 38 12" fill="none" stroke="url(#capricorn-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 57 32 Q 65 20 62 12" fill="none" stroke="url(#capricorn-grad)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="46" cy="38" r="1.5" fill="url(#capricorn-grad)"/>
    <circle cx="54" cy="38" r="1.5" fill="url(#capricorn-grad)"/>
    <!-- Body transition to fish -->
    <path d="M 50 50 Q 48 60 50 70" fill="none" stroke="url(#capricorn-grad)" stroke-width="2"/>
    <!-- Fish tail -->
    <path d="M 48 70 L 40 80" fill="none" stroke="url(#capricorn-grad)" stroke-width="2" stroke-linecap="round"/>
    <path d="M 52 70 L 60 80" fill="none" stroke="url(#capricorn-grad)" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  'Aquarius': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aquarius-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#5c7cfa;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4263eb;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#aquarius-grad)" opacity="0.1" stroke="url(#aquarius-grad)" stroke-width="2"/>
    <!-- Person -->
    <circle cx="50" cy="38" r="9" fill="none" stroke="url(#aquarius-grad)" stroke-width="2.5"/>
    <!-- Body -->
    <path d="M 50 47 L 50 62" fill="none" stroke="url(#aquarius-grad)" stroke-width="2.5"/>
    <!-- Arms holding urn -->
    <path d="M 50 50 L 38 55" fill="none" stroke="url(#aquarius-grad)" stroke-width="2"/>
    <path d="M 50 50 L 62 55" fill="none" stroke="url(#aquarius-grad)" stroke-width="2"/>
    <!-- Water urn -->
    <path d="M 42 55 L 42 70 Q 42 75 45 75 L 55 75 Q 58 75 58 70 L 58 55 Q 58 50 50 50 Q 42 50 42 55" fill="none" stroke="url(#aquarius-grad)" stroke-width="2"/>
    <!-- Water flowing -->
    <path d="M 48 65 Q 48 80 50 85" fill="none" stroke="url(#aquarius-grad)" stroke-width="1.5" opacity="0.7"/>
    <path d="M 52 65 Q 52 80 50 85" fill="none" stroke="url(#aquarius-grad)" stroke-width="1.5" opacity="0.7"/>
  </svg>`,

  'Pisces': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pisces-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#339af0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1971c2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="50" cy="50" r="35" fill="url(#pisces-grad)" opacity="0.1" stroke="url(#pisces-grad)" stroke-width="2"/>
    <!-- Fish 1 (top) -->
    <circle cx="40" cy="32" r="8" fill="none" stroke="url(#pisces-grad)" stroke-width="2.5"/>
    <!-- Fish 1 tail -->
    <path d="M 48 32 L 58 28 L 52 32 L 58 36" fill="none" stroke="url(#pisces-grad)" stroke-width="2" stroke-linejoin="round"/>
    <!-- Fish 2 (bottom) -->
    <circle cx="60" cy="68" r="8" fill="none" stroke="url(#pisces-grad)" stroke-width="2.5"/>
    <!-- Fish 2 tail -->
    <path d="M 52 68 L 42 72 L 48 68 L 42 64" fill="none" stroke="url(#pisces-grad)" stroke-width="2" stroke-linejoin="round"/>
    <!-- Connecting cord -->
    <path d="M 40 40 Q 50 50 60 60" fill="none" stroke="url(#pisces-grad)" stroke-width="1.5" stroke-dasharray="2,3" opacity="0.8"/>
    <!-- Fish 1 fin -->
    <path d="M 40 25 L 42 22 L 40 24" fill="none" stroke="url(#pisces-grad)" stroke-width="1.5" opacity="0.6"/>
    <!-- Fish 2 fin -->
    <path d="M 60 75 L 62 78 L 60 76" fill="none" stroke="url(#pisces-grad)" stroke-width="1.5" opacity="0.6"/>
  </svg>`
};

export function getZodiacSprite(sign) {
  return zodiacSprites[sign] || zodiacSprites['Aries'];
}

export function getAllZodiacSpritesSvg() {
  return zodiacSprites;
}
