import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';

/**
 * The Choice — standalone 11-second scene (330 frames at 30 fps).
 *
 * The dot resists the vortex. Motion reverses in layers—dust first, then paper
 * ribbons and star paths—while the camera and hero continue forward. A bright
 * seam opens like a seed and grows into a filament, ready to hand off to the
 * New Beginning scene. Procedural art is deterministic and asset-free.
 */
const DURATION = 330;
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const resolve = Easing.bezier(0.16, 1, 0.3, 1);
const deliberate = Easing.bezier(0.68, 0, 0.32, 1);
const surge = Easing.bezier(0.22, 0.7, 0.18, 1);

const Choice: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, DURATION);

  const stillness = interpolate(f, [0, 17, 32], [0.72, 1, 0], clamp);
  const choice = interpolate(f, [24, 95, 165, 246, 330], [0, 0.12, 0.42, 0.8, 1], {
    ...clamp,
    easing: deliberate,
  });
  const reverseDust = interpolate(f, [28, 92, 146], [0, 0.75, 1], {
    ...clamp,
    easing: resolve,
  });
  const reversePaper = interpolate(f, [62, 132, 198], [0, 0.7, 1], {
    ...clamp,
    easing: resolve,
  });
  const reverseStars = interpolate(f, [110, 184, 238], [0, 0.72, 1], {
    ...clamp,
    easing: resolve,
  });
  const dotX = interpolate(f, [0, 100, 220, 330], [960, 955, 960, 960], {
    ...clamp,
    easing: deliberate,
  });
  const dotY = interpolate(f, [0, 95, 210, 330], [540, 538, 528, 500], {
    ...clamp,
    easing: deliberate,
  });
  const dotR = interpolate(f, [0, 65, 150, 236, 290, 330], [39, 41, 50, 67, 79, 88], {
    ...clamp,
    easing: surge,
  });
  const seam = interpolate(f, [86, 165, 224, 284, 330], [0, 0.12, 0.62, 1, 1], {
    ...clamp,
    easing: resolve,
  });
  const shellOpen = interpolate(f, [142, 217, 276, 330], [0, 0.08, 0.58, 1], {
    ...clamp,
    easing: surge,
  });
  const filamentLength = interpolate(f, [202, 258, 330], [0, 210, 590], {
    ...clamp,
    easing: resolve,
  });
  const light = interpolate(f, [0, 48, 135, 226, 292, 330], [0.1, 0.2, 0.3, 0.58, 0.94, 1], clamp);
  const flare = interpolate(f, [278, 301, 317, 330], [0, 0.68, 0.3, 0.16], {
    ...clamp,
    easing: resolve,
  });
  const labelOpacity = interpolate(f, [0, 25, 190, 220], [0, 0.38, 0.38, 0], clamp);

  // Dust travels outward at first, then reverses toward a new orbit around the dot.
  const dust = Array.from({ length: 70 }, (_, i) => {
    const angle = i * 2.399963229728653;
    const startRadius = 76 + ((i * 97) % 560);
    const outward = interpolate(f, [0, 72, 142], [0, 1, 1], { ...clamp, easing: resolve });
    const inward = reverseDust * interpolate(f, [146, 248, 330], [0, 0.68, 1], clamp);
    const radius = startRadius + outward * (90 + (i % 7) * 12) - inward * (startRadius * 0.73);
    const drift = Math.sin(f / (8 + (i % 9)) + i) * (4 + (1 - inward) * 10);
    const x = dotX + Math.cos(angle + f * 0.003) * radius + drift;
    const y = dotY + Math.sin(angle + f * 0.003) * radius * 0.66 + Math.cos(f / 15 + i) * 7;
    const alpha = (0.22 + 0.58 * Math.abs(Math.sin(i * 3.7 + f / 14))) * (0.35 + reverseDust * 0.55);
    return { x, y, r: 1 + (i % 4) * 0.65, alpha, gold: i % 9 === 0 };
  });

  // Torn strips uncoil backward toward coherent sheets; camera motion stays forward.
  const ribbons = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.3;
    const outer = 350 + (i % 4) * 65;
    const inner = 105 + (i % 3) * 24;
    const unwind = reversePaper * interpolate(f, [134, 244, 330], [0, 0.74, 1], clamp);
    const twist = (1 - unwind) * (1.15 + (i % 4) * 0.13);
    const points = Array.from({ length: 22 }, (_, j) => {
      const u = j / 21;
      const theta = a + u * twist * Math.PI * 2;
      const r = outer * (1 - u) + inner * u;
      const x = dotX + Math.cos(theta) * r;
      const y = dotY + Math.sin(theta) * r * 0.68;
      return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    return { points, alpha: 0.12 + unwind * 0.36, width: 1.2 + (i % 3) * 0.85, gold: i % 4 === 0 };
  });

  // A few star paths retrace their old trajectories and reconnect into constellations.
  const stars = Array.from({ length: 54 }, (_, i) => {
    const angle = i * 2.183 + 0.6;
    const radius = 180 + ((i * 131) % 690);
    const r = radius * (1 - reverseStars * 0.58);
    const theta = angle - reverseStars * (0.8 + (i % 4) * 0.08);
    const x = dotX + Math.cos(theta) * r;
    const y = dotY + Math.sin(theta) * r * 0.64;
    const twinkle = 0.28 + 0.72 * Math.abs(Math.sin((f + i * 23) / (20 + (i % 7) * 2)));
    return { x, y, r: 0.9 + (i % 4) * 0.5, alpha: reverseStars * twinkle * 0.78 };
  });

  const shellOffset = shellOpen * (dotR * 0.76);
  const shardRotation = interpolate(f, [0, 170, 278, 330], [0, 18, 48, 63], {
    ...clamp,
    easing: deliberate,
  });
  const glowR = dotR * (3.7 + light * 1.8);
  const horizonOpacity = interpolate(f, [188, 246, 310, 330], [0, 0.14, 0.64, 0.92], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: '#03050a', overflow: 'hidden' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        role="img"
        aria-label="The last dot resists a cosmic collapse, reverses the flow of dust and paper, and opens like a glowing seed."
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="choice-space" cx="50%" cy="46%" r="78%">
            <stop offset="0" stopColor="#1a2231" />
            <stop offset="0.48" stopColor="#0c1320" />
            <stop offset="1" stopColor="#020408" />
          </radialGradient>
          <radialGradient id="choice-seed" cx="34%" cy="27%" r="80%">
            <stop offset="0" stopColor="#fff8e5" />
            <stop offset="0.18" stopColor="#f6dfaa" />
            <stop offset="0.5" stopColor="#c6a06a" />
            <stop offset="0.82" stopColor="#475166" />
            <stop offset="1" stopColor="#141b29" />
          </radialGradient>
          <radialGradient id="choice-aura">
            <stop offset="0" stopColor="#fff0cb" stopOpacity="0.8" />
            <stop offset="0.24" stopColor="#edd8ad" stopOpacity="0.34" />
            <stop offset="0.55" stopColor="#b5c7e5" stopOpacity="0.13" />
            <stop offset="1" stopColor="#8fa9d3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="choice-filament" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0" stopColor="#e9cb91" />
            <stop offset="0.46" stopColor="#fff2d2" />
            <stop offset="1" stopColor="#fffdf4" />
          </linearGradient>
          <linearGradient id="choice-shell-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3d5" />
            <stop offset="0.58" stopColor="#c7a873" />
            <stop offset="1" stopColor="#564a3e" />
          </linearGradient>
          <linearGradient id="choice-shell-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset="0.55" stopColor="#d4b582" />
            <stop offset="1" stopColor="#615342" />
          </linearGradient>
          <filter id="choice-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="36" />
          </filter>
          <filter id="choice-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <filter id="choice-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="2" seed="41" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 0.06" /></feComponentTransfer>
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
          <clipPath id="choice-core-clip"><circle cx={dotX} cy={dotY} r={dotR * 0.76} /></clipPath>
        </defs>

        <rect width="1920" height="1080" fill="url(#choice-space)" />

        {/* First, hold the collapse nearly still: the choice begins in quiet. */}
        <rect width="1920" height="1080" fill="#010205" opacity={stillness * 0.26} />

        {/* Expanding pressure rings soften and begin to move outward again. */}
        <g transform={`translate(${dotX} ${dotY}) rotate(${-11 + choice * 18})`} fill="none">
          {[0, 1, 2, 3].map((i) => {
            const r = 150 + i * 93 + reverseDust * (26 + i * 12) - choice * i * 9;
            return (
              <ellipse
                key={`ring-${i}`}
                cx="0"
                cy="0"
                rx={r}
                ry={r * 0.63}
                stroke={i % 2 ? '#bfcde1' : '#e8c98f'}
                strokeWidth={1.2 + (i % 2) * 0.8}
                opacity={(0.13 + reverseDust * 0.1) * (1 - i * 0.13)}
              />
            );
          })}
        </g>

        {/* Paper ribbons unwind in reverse, while the camera and seed keep moving forward. */}
        <g fill="none" strokeLinecap="round" filter="url(#choice-grain)">
          {ribbons.map((ribbon, i) => (
            <path
              key={`ribbon-${i}`}
              d={ribbon.points}
              stroke={ribbon.gold ? '#edcf98' : '#bccbe0'}
              strokeWidth={ribbon.width}
              opacity={ribbon.alpha}
            />
          ))}
        </g>

        {/* Ash and embers reverse into an orbit rather than simply rewinding the shot. */}
        {dust.map((p, i) => (
          <g key={`dust-${i}`} opacity={p.alpha}>
            <circle cx={p.x} cy={p.y} r={p.r} fill={p.gold ? '#f1d29b' : '#d5deec'} />
            {i % 11 === 0 && <path d={`M${p.x - 6} ${p.y + 2}l12 -4`} stroke="#f2dfbf" strokeWidth="1" opacity="0.6" />}
          </g>
        ))}

        {/* Scattered stars reconnect into a calm, incomplete constellation. */}
        {stars.map((s, i) => <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#e4ebf5" opacity={s.alpha} />)}
        <g fill="none" stroke="#d5deed" strokeWidth="1.2" opacity={reverseStars * 0.38}>
          <path d="M302 264L422 332L549 278L662 361L794 315" />
          <path d="M1135 252L1250 324L1377 270L1497 355L1628 304" />
          <path d="M412 780L526 710L654 770L778 694L901 747" />
          <path d="M1118 740L1242 677L1366 735L1495 663L1610 710" />
        </g>

        {/* The hero seed stays on the forward path; a seam appears before the shell opens. */}
        <circle cx={dotX} cy={dotY} r={glowR} fill="url(#choice-aura)" opacity={light} filter="url(#choice-bloom)" />
        <circle cx={dotX} cy={dotY} r={dotR * 1.06} fill="url(#choice-seed)" opacity={0.95 - shellOpen * 0.2} />
        <g clipPath="url(#choice-core-clip)" opacity={0.42 + seam * 0.5}>
          <path d={`M${dotX - dotR} ${dotY + dotR * 0.18}Q${dotX} ${dotY - dotR * 0.38} ${dotX + dotR} ${dotY + dotR * 0.12}V${dotY + dotR}H${dotX - dotR}Z`} fill="#fff0c8" opacity="0.6" />
          <path d={`M${dotX - dotR} ${dotY + dotR * 0.35}Q${dotX} ${dotY + dotR * 0.04} ${dotX + dotR} ${dotY + dotR * 0.28}`} fill="none" stroke="#fff9e9" strokeWidth="2" opacity="0.72" />
        </g>

        {/* Seed-shell halves peel away with controlled rotation, revealing a bright core. */}
        <g transform={`translate(${dotX} ${dotY})`}>
          <path
            d={`M-4 ${-dotR} C${-dotR * 1.02} ${-dotR * 0.66}, ${-dotR * 1.08} ${dotR * 0.48}, -2 ${dotR}`}
            fill="none"
            stroke="url(#choice-shell-left)"
            strokeWidth={Math.max(2, dotR * 0.88)}
            strokeLinecap="round"
            transform={`translate(${-shellOffset} ${shellOffset * 0.08}) rotate(${-shardRotation} 0 0)`}
            opacity={shellOpen * 0.94}
            filter="url(#choice-grain)"
          />
          <path
            d={`M4 ${-dotR} C${dotR * 1.02} ${-dotR * 0.66}, ${dotR * 1.08} ${dotR * 0.48}, 2 ${dotR}`}
            fill="none"
            stroke="url(#choice-shell-right)"
            strokeWidth={Math.max(2, dotR * 0.88)}
            strokeLinecap="round"
            transform={`translate(${shellOffset} ${-shellOffset * 0.08}) rotate(${shardRotation} 0 0)`}
            opacity={shellOpen * 0.92}
            filter="url(#choice-grain)"
          />
          <path
            d={`M0 ${-dotR * 0.72}Q${dotR * 0.13} ${-dotR * 0.05} 0 ${dotR * 0.75}`}
            fill="none"
            stroke="#fff9e6"
            strokeWidth={Math.max(1.4, dotR * 0.045)}
            opacity={seam * (1 - shellOpen * 0.38)}
          />
        </g>

        {/* The first new line of light rises from the split seed, setting up the finale. */}
        <path
          d={`M${dotX} ${dotY - dotR * 0.56} C${dotX + 18} ${dotY - dotR - filamentLength * 0.26}, ${dotX - 32} ${dotY - dotR - filamentLength * 0.72}, ${dotX + 10} ${dotY - dotR - filamentLength}`}
          fill="none"
          stroke="url(#choice-filament)"
          strokeWidth={interpolate(f, [202, 270, 330], [0.8, 2.8, 4.2], clamp)}
          strokeLinecap="round"
          opacity={interpolate(f, [200, 252, 292, 330], [0, 0.48, 0.86, 1], clamp)}
          filter="url(#choice-soft)"
        />
        <path
          d={`M${dotX} ${dotY - dotR * 0.56} C${dotX + 18} ${dotY - dotR - filamentLength * 0.26}, ${dotX - 32} ${dotY - dotR - filamentLength * 0.72}, ${dotX + 10} ${dotY - dotR - filamentLength}`}
          fill="none"
          stroke="url(#choice-filament)"
          strokeWidth={interpolate(f, [202, 270, 330], [0.7, 1.6, 2.2], clamp)}
          strokeLinecap="round"
          opacity={interpolate(f, [202, 252, 292, 330], [0, 0.68, 0.92, 1], clamp)}
        />

        {/* Subtle horizon line anticipates the new universe without revealing it too soon. */}
        <path d="M0 824Q480 798 960 824T1920 824" fill="none" stroke="#dfd1b2" strokeWidth="2" opacity={horizonOpacity} />
        <path d="M0 824Q480 798 960 824T1920 824" fill="none" stroke="#fff0cb" strokeWidth="16" opacity={horizonOpacity * 0.18} filter="url(#choice-soft)" />

        {/* Restrained bloom marks the decision; let the following scene own the full reveal. */}
        <circle cx={dotX} cy={dotY - dotR} r={dotR * 1.6} fill="#fff2d0" opacity={flare * 0.34} filter="url(#choice-bloom)" />
        <rect width="1920" height="1080" fill="#080a10" opacity={0.24 - choice * 0.13} style={{ mixBlendMode: 'multiply' }} />

        <text
          x="960"
          y="1000"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="13"
          letterSpacing="5"
          fill="#e9dfcd"
          opacity={labelOpacity}
        >
          THE CHOICE
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export default Choice;
