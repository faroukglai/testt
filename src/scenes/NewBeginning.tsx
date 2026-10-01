import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';

/**
 * A New Beginning — standalone 13-second finale (390 frames at 30 fps).
 *
 * The seed's filament becomes a horizon, then draws the opening words of a
 * new sentence. A tactile paper world rises into light, resolving on the final
 * line: “An ending is a place to begin.” Designed to follow Choice directly.
 * Procedural shapes are deterministic and require no external assets.
 */
const DURATION = 390;
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const warmEase = Easing.bezier(0.22, 0.7, 0.18, 1);
const settle = Easing.bezier(0.16, 1, 0.3, 1);
const deliberate = Easing.bezier(0.68, 0, 0.32, 1);

const NewBeginning: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, DURATION);

  const dawn = interpolate(f, [0, 64, 142, 230, 320, 390], [0, 0.06, 0.24, 0.58, 0.91, 1], {
    ...clamp,
    easing: warmEase,
  });
  const paperRise = interpolate(f, [0, 88, 180, 260, 330], [0, 0.12, 0.52, 0.9, 1], {
    ...clamp,
    easing: settle,
  });
  const horizonY = interpolate(f, [0, 55, 150, 260, 390], [824, 760, 674, 616, 592], {
    ...clamp,
    easing: deliberate,
  });
  const horizonGlow = interpolate(f, [0, 72, 180, 285, 390], [0.16, 0.27, 0.56, 0.82, 1], clamp);
  const heroX = interpolate(f, [0, 75, 170, 285, 390], [960, 955, 960, 960, 960], {
    ...clamp,
    easing: deliberate,
  });
  const heroY = interpolate(f, [0, 90, 184, 286, 390], [500, 474, 430, 393, 365], {
    ...clamp,
    easing: deliberate,
  });
  const heroR = interpolate(f, [0, 72, 162, 254, 330, 390], [38, 45, 54, 62, 69, 72], {
    ...clamp,
    easing: warmEase,
  });
  const halo = interpolate(f, [0, 95, 205, 306, 390], [0.28, 0.38, 0.56, 0.78, 0.9], clamp);
  const filamentLength = interpolate(f, [0, 65, 120, 200, 290], [0, 108, 242, 464, 680], {
    ...clamp,
    easing: settle,
  });
  const filamentOpacity = interpolate(f, [0, 20, 95, 180, 280], [0.25, 0.7, 0.95, 0.84, 0.34], clamp);
  const firstLine = interpolate(f, [88, 150, 206], [0, 0.65, 1], { ...clamp, easing: settle });
  const finalLine = interpolate(f, [197, 264, 316], [0, 0.68, 1], { ...clamp, easing: settle });
  const titleHold = interpolate(f, [305, 344, 390], [0, 1, 1], { ...clamp, easing: settle });
  const memoryWords = interpolate(f, [23, 95, 179, 248], [0.42, 0.27, 0.13, 0], clamp);
  const edgeLight = interpolate(f, [0, 125, 245, 390], [0.08, 0.16, 0.34, 0.58], clamp);
  const cameraScale = interpolate(f, [0, 115, 245, 390], [1.04, 1.02, 1, 1], {
    ...clamp,
    easing: deliberate,
  });
  const closingFade = interpolate(f, [0, 350, 390], [0, 0, 0.13], clamp);

  const petals = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + 0.18;
    const spread = interpolate(f, [0, 110, 245, 390], [0.12, 0.4, 0.82, 1], {
      ...clamp,
      easing: settle,
    });
    const orbit = 86 + (i % 6) * 22 + spread * (32 + (i % 5) * 18);
    const x = heroX + Math.cos(angle + f * 0.0015) * orbit;
    const y = heroY + Math.sin(angle + f * 0.0015) * orbit * 0.48;
    const length = 15 + (i % 4) * 7 + spread * 9;
    const rotation = (angle * 180) / Math.PI + 90;
    const opacity = interpolate(f, [0, 75, 190, 315, 390], [0.06, 0.2, 0.44, 0.3, 0.12], clamp);
    return { x, y, length, rotation, opacity, gold: i % 4 === 0 };
  });

  const skyStars = Array.from({ length: 68 }, (_, i) => {
    const x = (i * 313 + 121) % 1920;
    const y = (i * 197 + 59) % 1080;
    const twinkle = 0.25 + 0.75 * Math.abs(Math.sin((f + i * 13) / (24 + (i % 7) * 3)));
    const appear = interpolate(f, [22 + (i % 11) * 3, 110 + (i % 9) * 4, 245], [0, 0.7, 1], clamp);
    return { x, y, r: 0.8 + (i % 5) * 0.42, opacity: appear * twinkle * 0.68 * (1 - dawn * 0.48) };
  });

  const glyphs = ['memory', 'world', 'again', 'once', 'light', 'story', 'home', 'still'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#080b12', overflow: 'hidden' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        role="img"
        aria-label="A warm new paper horizon rises; a glowing seed draws the sentence An ending is a place to begin."
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="beginning-sky" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f0dfbc" />
            <stop offset="0.22" stopColor="#c4b9a5" />
            <stop offset="0.55" stopColor="#293449" />
            <stop offset="1" stopColor="#070a12" />
          </linearGradient>
          <linearGradient id="beginning-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff6df" />
            <stop offset="0.42" stopColor="#e9dcc1" />
            <stop offset="1" stopColor="#c6b697" />
          </linearGradient>
          <linearGradient id="beginning-horizon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f0dfbd" stopOpacity="0" />
            <stop offset="0.48" stopColor="#fff2d5" stopOpacity="0.98" />
            <stop offset="1" stopColor="#f0dfbd" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="beginning-seed" cx="32%" cy="27%" r="82%">
            <stop offset="0" stopColor="#fffdf0" />
            <stop offset="0.2" stopColor="#fff0c9" />
            <stop offset="0.56" stopColor="#d6b57c" />
            <stop offset="0.84" stopColor="#758196" />
            <stop offset="1" stopColor="#182235" />
          </radialGradient>
          <radialGradient id="beginning-aura">
            <stop offset="0" stopColor="#fff1cf" stopOpacity="0.82" />
            <stop offset="0.3" stopColor="#eddaaF" stopOpacity="0.34" />
            <stop offset="0.62" stopColor="#b9c8df" stopOpacity="0.12" />
            <stop offset="1" stopColor="#a3b5d2" stopOpacity="0" />
          </radialGradient>
          <filter id="beginning-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
          <filter id="beginning-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="beginning-paper-grain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="2" seed="53" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 0.07" /></feComponentTransfer>
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
          <clipPath id="beginning-paper-clip"><rect x="0" y={horizonY} width="1920" height={1080 - horizonY + 50} /></clipPath>
        </defs>

        {/* Space warms into dawn, while the horizon rises from the seed's filament. */}
        <rect width="1920" height="1080" fill="#070a12" />
        <rect width="1920" height="1080" fill="url(#beginning-sky)" opacity={dawn} />
        {skyStars.map((star, i) => (
          <circle key={`sky-star-${i}`} cx={star.x} cy={star.y} r={star.r} fill="#e4e9f0" opacity={star.opacity} />
        ))}

        {/* Ghosted vocabulary from the former universe passes through the new sky. */}
        {glyphs.map((word, i) => {
          const angle = -2.8 + i * 0.79;
          const drift = f * (0.1 + (i % 3) * 0.025);
          const x = 960 + Math.cos(angle) * (290 + (i % 4) * 112) + Math.sin(f / 67 + i) * 24;
          const y = 470 + Math.sin(angle) * (130 + (i % 3) * 44) - drift;
          const opacity = memoryWords * (0.54 + 0.46 * Math.abs(Math.sin(f / 32 + i)));
          return (
            <text
              key={`memory-${word}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={22 + (i % 4) * 7}
              letterSpacing="2"
              fill={i % 2 ? '#e8dcc5' : '#d9c79e'}
              opacity={opacity}
            >
              {word}
            </text>
          );
        })}

        {/* A paper landscape rises under the new horizon, softly catching first light. */}
        <g clipPath="url(#beginning-paper-clip)" opacity={paperRise}>
          <rect x="0" y={horizonY} width="1920" height={1080 - horizonY + 50} fill="url(#beginning-paper)" filter="url(#beginning-paper-grain)" />
          <path d={`M0 ${horizonY + 124}Q440 ${horizonY + 42} 850 ${horizonY + 112}T1920 ${horizonY + 96}`} fill="none" stroke="#9a8c73" strokeWidth="3" opacity="0.28" />
          <path d={`M0 ${horizonY + 238}Q520 ${horizonY + 156} 1000 ${horizonY + 224}T1920 ${horizonY + 206}`} fill="none" stroke="#fff8e6" strokeWidth="4" opacity="0.4" />
          <path d={`M0 ${horizonY + 365}Q460 ${horizonY + 295} 940 ${horizonY + 360}T1920 ${horizonY + 336}`} fill="none" stroke="#8e8068" strokeWidth="2" opacity="0.25" />
          <path d={`M0 ${horizonY + 486}Q520 ${horizonY + 420} 1040 ${horizonY + 474}T1920 ${horizonY + 455}`} fill="none" stroke="#fff8e6" strokeWidth="3" opacity="0.32" />
          <path d={`M240 ${horizonY + 30}L420 ${horizonY + 220}L560 ${horizonY + 74}`} fill="none" stroke="#fff8e7" strokeWidth="2" opacity="0.22" />
          <path d={`M1430 ${horizonY + 52}L1594 ${horizonY + 244}L1720 ${horizonY + 82}`} fill="none" stroke="#726651" strokeWidth="2" opacity="0.16" />
        </g>

        {/* Horizon line and bloom echo the opening filament without a hard cut. */}
        <path d={`M0 ${horizonY}Q480 ${horizonY - 24} 960 ${horizonY}T1920 ${horizonY - 5}`} fill="none" stroke="url(#beginning-horizon)" strokeWidth={2 + horizonGlow * 2.2} opacity={horizonGlow} />
        <path d={`M0 ${horizonY}Q480 ${horizonY - 24} 960 ${horizonY}T1920 ${horizonY - 5}`} fill="none" stroke="#fff0cb" strokeWidth="22" opacity={horizonGlow * 0.24} filter="url(#beginning-soft)" />

        {/* Seed-petal motes open outward, then settle into a small orbital frame. */}
        {petals.map((p, i) => (
          <ellipse
            key={`petal-${i}`}
            cx={p.x}
            cy={p.y}
            rx={p.length}
            ry={Math.max(1.2, p.length * 0.17)}
            fill={p.gold ? '#f4d9a7' : '#dce4ef'}
            opacity={p.opacity}
            transform={`rotate(${p.rotation} ${p.x} ${p.y})`}
          />
        ))}

        {/* The returning dot is now a warm seed, holding the story's shape anchor. */}
        <circle cx={heroX} cy={heroY} r={heroR * 4.3} fill="url(#beginning-aura)" opacity={halo} filter="url(#beginning-bloom)" />
        <circle cx={heroX} cy={heroY} r={heroR} fill="url(#beginning-seed)" stroke="#fff1d1" strokeOpacity="0.72" strokeWidth="2" />
        <circle cx={heroX - heroR * 0.28} cy={heroY - heroR * 0.3} r={heroR * 0.1} fill="#fffdf1" opacity="0.9" />

        {/* A fine filament grows from the seed and becomes a path toward the horizon. */}
        <path
          d={`M${heroX} ${heroY + heroR * 0.35} C${heroX - 34} ${heroY + heroR + filamentLength * 0.26}, ${heroX + 46} ${heroY + heroR + filamentLength * 0.64}, ${heroX - 6} ${heroY + heroR + filamentLength}`}
          fill="none"
          stroke="#f2dfbd"
          strokeWidth="14"
          opacity={filamentOpacity * 0.2}
          filter="url(#beginning-soft)"
        />
        <path
          d={`M${heroX} ${heroY + heroR * 0.35} C${heroX - 34} ${heroY + heroR + filamentLength * 0.26}, ${heroX + 46} ${heroY + heroR + filamentLength * 0.64}, ${heroX - 6} ${heroY + heroR + filamentLength}`}
          fill="none"
          stroke="url(#beginning-horizon)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={filamentOpacity}
        />

        {/* The closing thought types on as a quiet two-line end card. */}
        <g opacity={firstLine * (1 - finalLine * 0.22)}>
          <text x="960" y="835" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="35" letterSpacing="1.5" fill="#292722" opacity={paperRise * 0.96}>
            And so, it began.
          </text>
        </g>
        <g opacity={finalLine * titleHold}>
          <text x="960" y="834" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="44" letterSpacing="0.4" fill="#292722" opacity={paperRise * 0.98}>
            An ending is a place to begin.
          </text>
          <path d="M766 862Q960 874 1154 862" fill="none" stroke="#9e8155" strokeWidth="1.5" opacity={paperRise * 0.62} />
        </g>

        {/* Warm side-light reveals paper grain while preserving a dark, cinematic sky. */}
        <rect width="1920" height="1080" fill="#f1ddaf" opacity={edgeLight * 0.12} style={{ mixBlendMode: 'screen' }} />
        <rect width="1920" height="1080" fill="#060810" opacity={closingFade} style={{ mixBlendMode: 'multiply' }} />

        <text
          x="960"
          y="1000"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          letterSpacing="5"
          fill="#eee4d0"
          opacity={interpolate(f, [8, 32, 188, 218], [0, 0.38, 0.38, 0], clamp)}
        >
          A NEW BEGINNING
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export default NewBeginning;
