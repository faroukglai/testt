import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * Worlds of Forgotten Words — standalone 10-second scene (300 frames at 30 fps).
 *
 * Intended to follow the opening shot: the hero dot travels through a paper
 * cosmos while a word sheds its letters into birds, ash, and stars. All shapes
 * and motion are deterministic and asset-free. Add this component to a parent
 * timeline with a 300-frame Sequence at the appropriate global frame.
 */
const DURATION = 300;
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const smooth = Easing.bezier(0.76, 0, 0.24, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

const WordWorlds: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const f = Math.min(frame, DURATION);
  const sx = width / 1920;
  const sy = height / 1080;

  // The camera drifts through successive typographic planes, ending in open sky.
  const worldScale = interpolate(f, [0, 72, 170, 300], [1, 1.12, 1.38, 1.72], {
    ...clamp,
    easing: smooth,
  });
  const worldX = interpolate(f, [0, 100, 200, 300], [0, -48, -126, -220], {
    ...clamp,
    easing: smooth,
  });
  const worldY = interpolate(f, [0, 120, 220, 300], [0, 18, -34, -95], {
    ...clamp,
    easing: smooth,
  });
  const paperOpacity = interpolate(f, [0, 30, 92, 158, 236, 300], [1, 1, 0.82, 0.53, 0.18, 0], clamp);
  const skyOpacity = interpolate(f, [0, 72, 150, 220, 300], [0, 0.06, 0.34, 0.78, 1], clamp);

  // Hero dot is intentionally legible and central while its surrounding world moves.
  const heroX = interpolate(f, [0, 85, 190, 300], [960, 935, 980, 1012], {
    ...clamp,
    easing: smooth,
  });
  const heroY = interpolate(f, [0, 70, 178, 300], [520, 484, 526, 468], {
    ...clamp,
    easing: smooth,
  });
  const heroR = interpolate(f, [0, 55, 135, 230, 300], [12, 20, 31, 40, 46], {
    ...clamp,
    easing: smooth,
  });
  const heroGlow = interpolate(f, [0, 62, 125, 205, 300], [0.08, 0.16, 0.34, 0.42, 0.52], clamp);

  // The word is held long enough to read, then its glyphs peel into a flock.
  const wordIn = interpolate(f, [0, 14, 32], [0, 1, 1], { ...clamp, easing: out });
  const letterRelease = interpolate(f, [54, 102, 135], [0, 0.45, 1], {
    ...clamp,
    easing: smooth,
  });
  const wordFade = interpolate(f, [110, 158, 194], [1, 0.62, 0], clamp);
  const birdIn = interpolate(f, [82, 112, 151], [0, 0.65, 1], { ...clamp, easing: out });
  const ashIn = interpolate(f, [132, 170, 218], [0, 0.65, 1], { ...clamp, easing: smooth });
  const starIn = interpolate(f, [194, 242, 300], [0, 0.55, 1], { ...clamp, easing: smooth });
  const paperFold = interpolate(f, [38, 88, 138], [0, 0.8, 1], { ...clamp, easing: smooth });
  const lightSweep = interpolate(f, [0, 100, 180, 300], [-260, 400, 1260, 2190], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  const birds = Array.from({ length: 13 }, (_, i) => {
    const delay = i * 5;
    const local = Math.max(0, f - 88 - delay);
    const p = interpolate(local, [0, 142], [0, 1], { ...clamp, easing: out });
    const x0 = 695 + (i % 5) * 37;
    const y0 = 462 + Math.floor(i / 5) * 20;
    const x = x0 + p * (220 + (i % 4) * 48) + Math.sin((f + i * 11) / 17) * 12;
    const y = y0 - p * (92 + (i % 6) * 24) + Math.sin((f + i * 13) / 9) * (4 + p * 7);
    const scale = 0.28 + (i % 4) * 0.08 + p * 0.45;
    const wing = Math.sin((f + i * 9) / 4.3) * 9;
    const opacity = birdIn * (1 - interpolate(f, [240, 286, 300], [0, 0.4, 0.78], clamp));
    return { x, y, scale, wing, opacity, rotate: -22 + p * 13 + (i % 3) * 5 };
  });

  const ash = Array.from({ length: 64 }, (_, i) => {
    const x0 = (i * 149 + 88) % 1920;
    const y0 = (i * 233 + 126) % 1080;
    const drift = Math.max(0, f - 128);
    const x = (x0 + drift * (0.42 + (i % 5) * 0.13) + Math.sin((f + i * 7) / 15) * 17) % 2020 - 50;
    const y = y0 - drift * (0.24 + (i % 7) * 0.1) + Math.cos((f + i * 3) / 19) * 13;
    const opacity = ashIn * (0.2 + 0.55 * Math.abs(Math.sin((f + i * 17) / 31)));
    return { x, y, r: 1 + (i % 4) * 0.65, opacity };
  });

  const stars = Array.from({ length: 84 }, (_, i) => {
    const x = (i * 313 + 47) % 1920;
    const y = (i * 197 + 113) % 1080;
    const r = 0.8 + (i % 5) * 0.42;
    const twinkle = 0.28 + 0.72 * Math.abs(Math.sin((f + i * 19) / (20 + (i % 7) * 3)));
    return { x, y, r, opacity: starIn * twinkle * 0.78 };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#080b12', overflow: 'hidden' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        role="img"
        aria-label="A luminous punctuation mark crosses a paper cosmos as the word remember becomes birds, ash, and stars."
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="ww-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3ead7" />
            <stop offset="0.52" stopColor="#e5d9c1" />
            <stop offset="1" stopColor="#bdb196" />
          </linearGradient>
          <linearGradient id="ww-fold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff9e9" stopOpacity="0.82" />
            <stop offset="0.52" stopColor="#8a806e" stopOpacity="0.18" />
            <stop offset="1" stopColor="#332f2a" stopOpacity="0.56" />
          </linearGradient>
          <radialGradient id="ww-space" cx="51%" cy="44%" r="72%">
            <stop offset="0" stopColor="#1d2a40" />
            <stop offset="0.52" stopColor="#101827" />
            <stop offset="1" stopColor="#05070d" />
          </radialGradient>
          <radialGradient id="ww-dot" cx="32%" cy="28%" r="78%">
            <stop offset="0" stopColor="#fff9e8" />
            <stop offset="0.25" stopColor="#f2dfb8" />
            <stop offset="0.7" stopColor="#c49c68" />
            <stop offset="1" stopColor="#654f3e" />
          </radialGradient>
          <radialGradient id="ww-halo">
            <stop offset="0" stopColor="#f7e7c7" stopOpacity="0.58" />
            <stop offset="0.28" stopColor="#c8d7ee" stopOpacity="0.2" />
            <stop offset="1" stopColor="#9bb2d3" stopOpacity="0" />
          </radialGradient>
          <filter id="ww-paper-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="19" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 0.075" /></feComponentTransfer>
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
          <filter id="ww-blur"><feGaussianBlur stdDeviation="31" /></filter>
          <filter id="ww-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="blur" />
            <feOffset dy="14" result="offset" />
            <feComponentTransfer><feFuncA type="linear" slope="0.32" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="ww-page-clip"><rect x="120" y="115" width="1680" height="850" rx="3" /></clipPath>
        </defs>

        <rect width="1920" height="1080" fill="url(#ww-space)" />
        {stars.map((s, i) => <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#dce8fa" opacity={s.opacity} />)}

        {/* Carry the previous scene's paper texture into a folded word-world. */}
        <g opacity={paperOpacity} transform={`translate(${960 + worldX} ${540 + worldY}) scale(${worldScale}) translate(-960 -540)`}>
          <rect x="120" y="115" width="1680" height="850" fill="url(#ww-paper)" filter="url(#ww-paper-grain)" />
          <g clipPath="url(#ww-page-clip)">
            <path d="M120 115H1800V965H120Z" fill="none" stroke="#6b6254" strokeOpacity="0.18" strokeWidth="3" />
            <path d="M120 115L430 330L120 540Z" fill="url(#ww-fold)" opacity={paperFold * 0.48} />
            <path d="M1800 115L1480 310L1800 560Z" fill="url(#ww-fold)" opacity={paperFold * 0.38} />
            <path d="M120 965L400 745L120 580Z" fill="url(#ww-fold)" opacity={paperFold * 0.28} />
            <path d="M1800 965L1500 760L1800 590Z" fill="url(#ww-fold)" opacity={paperFold * 0.32} />
            <path d="M180 172L780 900M1740 170L1150 904" stroke="#fff9eb" strokeWidth="2" opacity={paperFold * 0.24} />

            {/* A single readable word anchors the metamorphosis. */}
            <text
              x="730"
              y="505"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="58"
              letterSpacing="12"
              fill="#292722"
              opacity={wordIn * wordFade * (1 - letterRelease * 0.16)}
              filter="url(#ww-shadow)"
            >
              REMEMBER
            </text>
            <text
              x="730"
              y="561"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              letterSpacing="5"
              fill="#625a4e"
              opacity={wordIn * interpolate(f, [24, 42], [0, 0.7], clamp) * (1 - wordFade * 0.65)}
            >
              EVERY WORD LEAVES A TRACE
            </text>
          </g>
        </g>

        {/* A travelling light links the paper folds to the emerging sky. */}
        <path
          d={`M${lightSweep - 280} 0L${lightSweep + 180} 0L${lightSweep - 240} 1080L${lightSweep - 700} 1080Z`}
          fill="#f8e7c6"
          opacity={interpolate(f, [34, 86, 122, 190], [0, 0.17, 0.11, 0], clamp) * (1 - skyOpacity * 0.55)}
          filter="url(#ww-blur)"
        />

        {/* Letters resolve into bird silhouettes; wings flap with deterministic cycles. */}
        {birds.map((bird, i) => (
          <g
            key={`bird-${i}`}
            transform={`translate(${bird.x} ${bird.y}) rotate(${bird.rotate}) scale(${bird.scale})`}
            opacity={bird.opacity}
          >
            <path
              d={`M-22 2 Q-14 ${-12 - bird.wing} 0 0 Q14 ${-12 + bird.wing} 25 -1 Q12 -3 2 8 Q-8 2 -22 2Z`}
              fill={i % 3 === 0 ? '#f0dfbd' : '#d8d4cc'}
              stroke="#f8e8cb"
              strokeOpacity="0.36"
              strokeWidth="1.2"
            />
            <circle cx="-5" cy="0" r="1.2" fill="#303441" opacity="0.55" />
          </g>
        ))}

        {/* Word fragments disintegrate into drifting paper-ash motes. */}
        {ash.map((p, i) => (
          <g key={`ash-${i}`} opacity={p.opacity}>
            <circle cx={p.x} cy={p.y} r={p.r} fill={i % 5 === 0 ? '#e7c58c' : '#e8e4dc'} />
            {i % 9 === 0 && <path d={`M${p.x - 5} ${p.y}l10 -3`} stroke="#f3d9a9" strokeWidth="1" opacity="0.65" />}
          </g>
        ))}

        {/* Soft edge-shape echoes carry the circular punctuation motif through scale. */}
        <circle cx={heroX} cy={heroY} r={heroR * 4.7} fill="url(#ww-halo)" opacity={heroGlow} />
        <circle cx={heroX} cy={heroY} r={heroR} fill="url(#ww-dot)" stroke="#fff1d2" strokeOpacity="0.64" strokeWidth="1.3" />
        <circle cx={heroX - heroR * 0.27} cy={heroY - heroR * 0.31} r={Math.max(1.8, heroR * 0.075)} fill="#fff8e9" opacity="0.84" />

        {/* Star threads emerge from the flock's wake and connect into constellations. */}
        <g opacity={starIn * 0.46} fill="none" stroke="#d7dfed" strokeWidth="1.2">
          <path d="M412 264L527 337L650 290L768 366L903 321" />
          <path d="M1214 269L1315 351L1450 303L1568 390L1694 334" />
          <path d="M520 748L648 676L771 748L903 687L1046 758" />
          <path d="M1202 735L1323 659L1451 727L1585 657" />
        </g>
        {stars.map((s, i) => (
          <circle key={`constellation-${i}`} cx={s.x} cy={s.y} r={s.r * 1.65} fill="#f2e5c9" opacity={s.opacity * 0.5} />
        ))}

        {/* Soft filmic vignette; keep the hero dot free of distortion. */}
        <rect width="1920" height="1080" fill="#05070c" opacity={interpolate(f, [0, 100, 200, 300], [0.16, 0.22, 0.28, 0.34], clamp)} style={{ mixBlendMode: 'multiply' }} />

        {/* Scene label fades before the handoff; no text is baked into the end card. */}
        <text
          x="960"
          y="1000"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="13"
          letterSpacing="5"
          fill="#ebe2d2"
          opacity={interpolate(f, [18, 42, 112, 154], [0, 0.42, 0.42, 0], clamp)}
        >
          WORLDS OF FORGOTTEN WORDS
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export default WordWorlds;
