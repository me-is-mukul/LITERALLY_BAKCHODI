import { getZodiacSprite } from '../utils/zodiacSprites';
import { getZodiacColor } from '../utils/zodiacUI';

export default function ZodiacIcon({ sign, size = 56, stroke = false, animate = false, colored = false, variant = 'default' }) {
  const spriteContent = getZodiacSprite(sign);
  const zodiacColor = getZodiacColor(sign);

  let bgClass = 'bg-gradient-to-br from-white to-slate-50';
  let borderColor = 'none';

  if (colored) {
    if (variant === 'player') {
      // You - use zodiac color with glow
      bgClass = 'bg-gradient-to-br to-white';
      borderColor = `3px solid ${zodiacColor}`;
    } else if (variant === 'opponent') {
      // Opponent - use purple/blue tint
      bgClass = 'bg-gradient-to-br from-slate-200 to-slate-100';
      borderColor = '3px solid rgba(139, 92, 246, 0.6)';
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-3xl ${bgClass} shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all ${
        animate ? 'hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]' : ''
      } ${variant === 'player' ? 'shadow-[0_0_20px_var(--zodiac-color,rgba(0,0,0,0.3))]' : ''}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        border: borderColor,
        '--zodiac-color': `${zodiacColor}40`,
      }}
    >
      <div
        className={`w-full h-full flex items-center justify-center ${animate ? 'animate-float' : ''}`}
        dangerouslySetInnerHTML={{ __html: spriteContent }}
        role="img"
        aria-label={sign}
      />
    </div>
  );
}
