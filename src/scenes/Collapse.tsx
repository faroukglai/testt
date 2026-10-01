import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * The Collapse — standalone 11-second scene (330 frames at 30 fps).
 *
 * A vortex of torn typography draws the paper cosmos inward. The hero dot
 * remains the visual anchor; fleeting memory-shapes shimmer inside it as the
 * world approaches collapse. Designed to hand off directly into the Choice
 * scene. All procedural elements are deterministic and asset-free.
 */
const DURATION = 330;
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const cinematic = Easing.bezier(0.76, 0, 0.24, 1);
const accelerate = Easing.bezier(0.48, 0, 0.92, 0.48);
const settle = Easing.bezier(0.16, 1, 0.3, 1);

const Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const f = Math.min(frame, DURATION);
  const sx = width / 1920;
  const sy = height / 1080;
  const centerX = 960;
  const centerY = 540;

  const collapse = interpolate(f, [0, 85, 188, 270, 330], [0, 0.12, 0.48, 0.88, 1], {
    ...clamp,
    easing: accelerate,
  });
  const vortexOpacity = interpolate(f, [0, 35, 95, 180, 270, 330], [0, 0.16, 0.28, 0.46, 0.8, 1], clamp);
  const paperFade = interpolate(f, [0, 75, 180, 270, 330], [0.76, 0.68, 0.45, 0.18, 0.04], clamp);
  const heroX = interpolate(f, [0, 100, 220, 330], [1012, 986, 960, 960], {
    ...clamp,
    easing: cinematic,
  });
  const heroY = interpolate(f, [0, 85, 205, 330], [468, 492, 534, 540], {
    ...clamp,
    easing: cinematic,
  });
  const heroR = interpolate(f, [0, 100, 210, 280, 330], [46, 51, 57, 49, 39], {
    ...clamp,
    easing: cinematic,
  });
  const heroLight = interpolate(f, [0, 80, 180, 250, 310, 330], [0.44, 0.4, 0.32, 0.26, 0.36, 0.54], clamp);
  const memoryReveal = interpolate(f, [38, 95, 135], [0, 0.58, 1], { ...clamp, easing: settle });
  const memoryFlicker = 0.78 + 0.22 * Math.sin(f / 3.7);
  const distortion = interpolate(f, [0, 95, 190, 270, 330], [0, 0.1, 0.36, 0.72, 1], clamp);
  const pulse = 0.5 + 0.5 * Math.sin(f / 8.2);
  const finalPressure = interpolate(f, [254, 305, 330], [0, 0.58, 1], { ...clamp, easing: cinematic });
  const labelOpacity = interpolate(f, [0, 25, 180, 218], [0, 0.42, 0.42, 0], clamp);

  // Letter fragments begin as recognizable words, then spiral into the core.
  const fragments = Array.from({ length: 58 }, (_, i) => {
    const angle0 = (i * 2.399963229728653) + (i % 4) * 0.13;
    const radius0 = 235 + ((i * 83) % 510);
    const turns = collapse * (1.8 + (i % 5) * 0.13);
    const angle = angle0 + turns * Math.PI * 2;
    const radius = radius0 * (1 - collapse * (0.76 + (i % 7) * 0.025));
    const wobble = Math.sin(f / (8 + (i % 6)) + i * 2.3) * (8 + collapse * 18);
    const x = centerX + Math.cos(angle) * radius + wobble;
    const y = centerY + Math.sin(angle) * radius * 0.62 + Math.cos(f / 13 + i) * 10;
    const scale = 0.68 + (i % 6) * 0.16 + collapse * 0.48;
    const rotation = (angle * 180) / Math.PI + (i % 2 ? 90 : -90) * collapse;
    const alpha = vortexOpacity * (0.28 + 0.62 * Math.abs(Math.sin(i * 7.1 + f / 19)));
    const glyph = ['A', 'R', 'E', 'M', 'N', 'O', '—', '…', 'D', 'S'][i % 10];
    return { x, y, scale, rotation, alpha, glyph, size: 18 + (i % 5) * 7 };
  });

  // Fine paper filaments wind around the singularity and tighten over time.
  const filaments = Array.from({ length: 11 }, (_, i) => {
    const startAngle = (i / 11) * Math.PI * 2;
    const outer = 370 + (i % 4) * 72;
    const inner = 66 + collapse * 40 + (i % 3) * 18;
    const sweep = collapse * (2.1 + (i % 4) * 0.26);
    const points = Array.from({ length: 18 }, (_, j) => {
      const u = j / 17;
      const angle = startAngle + u * sweep * Math.PI;
      const r = outer * (1 - u) + inner * u;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r * 0.72;
      return `${j === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    return { points, opacity: vortexOpacity * (0.18 + (i % 4) * 0.08), width: 1 + (i % 3) * 0.8 };
  });

  const debris = Array.from({ length: 76 }, (_, i) => {
    const angle = i * 2.417 + Math.sin(f / 17 + i) * 0.16;
    const radius0 = 110 + ((i * 127) % 700);
    const radius = radius0 * (1 - collapse * (0.82 + (i % 5) * 0.025));
    const x = centerX + Math.cos(angle + collapse * 7) * radius;
    const y = centerY + Math.sin(angle + collapse * 7) * radius * 0.68;
    const size = 1.2 + (i % 5) * 0.7;
    const opacity = vortexOpacity * (0.22 + 0.55 * Math.abs(Math.sin(i * 4 + f / 11)));
    return { x, y, size, opacity, warm: i % 8 === 0 };
  });

  // A few symbolic memory silhouettes, clipped to the inside of the hero dot.
  const memoryShift = interpolate(f, [80, 210, 330], [0, -13, 4], {
    ...clamp,
    easing: cinematic,
  });
  const memoryOpacity = memoryReveal * memoryFlicker * interpolate(f, [268, 310, 330], [1, 0.82, 0.52], clamp);
  const ringR = interpolate(f, [0, 100, 220, 330], [105, 162, 286, 390], {
    ...clamp,
    easing: settle,
  });
  const ringAlpha = vortexOpacity * (0.24 + pulse * 0.22);

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070d', overflow: 'hidden' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        role="img"
        aria-label="Torn words and paper filaments spiral into a dark center while memories flicker inside the last dot."
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="collapse-space" cx="50%" cy="49%" r="76%">
            <stop offset="0" stopColor="#171c2a" />
            <stop offset="0.42" stopColor="#111827" />
            <stop offset="1" stopColor="#030509" />
          </radialGradient>
          <radialGradient id="collapse-core" cx="32%" cy="27%" r="82%">
            <stop offset="0" stopColor="#fff5dc" />
            <stop offset="0.2" stopColor="#e0c48c" />
            <stop offset="0.52" stopColor="#75839b" />
            <stop offset="0.82" stopColor="#20283a" />
            <stop offset="1" stopColor="#0b101b" />
          </radialGradient>
          <radialGradient id="collapse-halo">
            <stop offset="0" stopColor="#f4dbab" stopOpacity="0.54" />
            <stop offset="0.32" stopColor="#b8c9e5" stopOpacity="0.22" />
            <stop offset="1" stopColor="#93a9cb" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="collapse-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3ead7" />
            <stop offset="0.55" stopColor="#d8cbb3" />
            <stop offset="1" stopColor="#978d7b" />
          </linearGradient>
          <filter id="collapse-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
          <filter id="collapse-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="collapse-grain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="2" seed="27" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 0.08" /></feComponentTransfer>
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
          <clipPath id="collapse-memory-clip">
            <circle cx={heroX} cy={heroY} r={heroR * 0.78} />
          </clipPath>
          <mask id="collapse-edge-fade">
            <rect width="1920" height="1080" fill="white" />
            <circle cx={centerX} cy={centerY} r={ringR * 1.9} fill="black" opacity={finalPressure * 0.36} />
          </mask>
        </defs>

        <rect width="1920" height="1080" fill="url(#collapse-space)" />

        {/* Remnants of the paper universe retreat into a deep, rotating lens. */}
        <g opacity={paperFade} transform={`translate(${centerX} ${centerY}) rotate(${collapse * 18}) scale(${1 - collapse * 0.28}) translate(${-centerX} ${-centerY})`}>
          <path d="M120 160L870 255L760 468L190 410Z" fill="url(#collapse-paper)" filter="url(#collapse-grain)" />
          <path d="M1800 120L1150 238L1230 450L1740 392Z" fill="url(#collapse-paper)" filter="url(#collapse-grain)" />
          <path d="M180 930L735 695L825 870L360 1030Z" fill="url(#collapse-paper)" opacity="0.82" />
          <path d="M1765 948L1190 690L1090 864L1550 1040Z" fill="url(#collapse-paper)" opacity="0.72" />
          <path d="M210 304L752 386M1703 290L1173 371M324 906L796 730M1594 916L1127 730" stroke="#fff4dd" strokeWidth="3" opacity="0.38" />
        </g>

        {/* Elliptical event-horizon rings expand, wobble, then tighten toward choice. */}
        <g transform={`translate(${centerX} ${centerY}) scale(1 ${0.58 + distortion * 0.12}) rotate(${-8 + collapse * 22})`}>
          {[0, 1, 2, 3, 4].map((i) => {
            const r = ringR * (0.54 + i * 0.17);
            const wobble = Math.sin(f / (7 + i) + i) * (2 + distortion * 8);
            return (
              <ellipse
                key={`ring-${i}`}
                cx="0"
                cy="0"
                rx={r + wobble}
                ry={(r + wobble) * (0.62 + i * 0.025)}
                fill="none"
                stroke={i % 2 ? '#d7dff0' : '#e8cca0'}
                strokeWidth={Math.max(1, (5 - i * 0.68) * (1 + distortion * 0.45))}
                opacity={ringAlpha * (1 - i * 0.12)}
              />
            );
          })}
        </g>

        {/* Curved paper filaments give the vortex a layered, hand-built feel. */}
        <g fill="none" strokeLinecap="round">
          {filaments.map((line, i) => (
            <path
              key={`filament-${i}`}
              d={line.points}
              stroke={i % 3 === 0 ? '#f2d8a8' : '#c6d2e4'}
              strokeWidth={line.width}
              opacity={line.opacity}
            />
          ))}
        </g>

        {/* Torn glyphs and dust are pulled inward on distinct spiral paths. */}
        {fragments.map((piece, i) => (
          <g
            key={`glyph-${i}`}
            transform={`translate(${piece.x} ${piece.y}) rotate(${piece.rotation}) scale(${piece.scale})`}
            opacity={piece.alpha}
          >
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={piece.size}
              fontWeight={i % 4 === 0 ? 700 : 400}
              fill={i % 6 === 0 ? '#f2d7a7' : '#dce3ed'}
            >
              {piece.glyph}
            </text>
            {i % 7 === 0 && <path d="M-18 8L17 -7" stroke="#fff1d5" strokeWidth="1.2" opacity="0.58" />}
          </g>
        ))}
        {debris.map((p, i) => (
          <circle
            key={`debris-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.warm ? '#f0d39f' : '#cbd8eb'}
            opacity={p.opacity}
          />
        ))}

        {/* A faint radial lens distortion is represented by curved pressure arcs. */}
        <g fill="none" stroke="#b8c9e2" strokeWidth="2" opacity={distortion * 0.16}>
          <path d={`M0 ${centerY - 310} Q${centerX} ${centerY - 190 - distortion * 70} 1920 ${centerY - 280}`} />
          <path d={`M0 ${centerY + 315} Q${centerX} ${centerY + 180 + distortion * 75} 1920 ${centerY + 280}`} />
          <path d={`M${centerX - 510} 0 Q${centerX - 350} ${centerY} ${centerX - 460} 1080`} />
          <path d={`M${centerX + 500} 0 Q${centerX + 340} ${centerY} ${centerX + 455} 1080`} />
        </g>

        {/* The hero dot absorbs reflected memories; imagery is clipped to its disc. */}
        <circle cx={heroX} cy={heroY} r={heroR * 2.8} fill="url(#collapse-halo)" opacity={heroLight} filter="url(#collapse-glow)" />
        <circle cx={heroX} cy={heroY} r={heroR} fill="url(#collapse-core)" />
        <g clipPath="url(#collapse-memory-clip)" opacity={memoryOpacity}>
          <rect x={heroX - heroR} y={heroY - heroR} width={heroR * 2} height={heroR * 2} fill="#172033" opacity="0.54" />
          {/* Tiny remembered window and horizon: evocative shapes, not literal inserts. */}
          <path d={`M${heroX - 34} ${heroY + 7 + memoryShift} Q${heroX} ${heroY - 29 + memoryShift} ${heroX + 36} ${heroY + 5 + memoryShift} L${heroX + 36} ${heroY + 32} L${heroX - 34} ${heroY + 32}Z`} fill="#f6e3bb" opacity="0.78" />
          <path d={`M${heroX - 13} ${heroY + 5 + memoryShift}V${heroY + 32}M${heroX + 14} ${heroY + 5 + memoryShift}V${heroY + 32}M${heroX - 34} ${heroY + 18 + memoryShift}H${heroX + 36}`} stroke="#465168" strokeWidth="2" opacity="0.9" />
          <path d={`M${heroX - 55} ${heroY + 36}Q${heroX - 10} ${heroY + 20 + memoryShift} ${heroX + 52} ${heroY + 38}V${heroY + 65}H${heroX - 55}Z`} fill="#b6c5d9" opacity="0.7" />
          <circle cx={heroX + 18} cy={heroY - 17 - memoryShift * 0.3} r="7" fill="#fff1d2" opacity="0.85" />
        </g>
        <circle cx={heroX} cy={heroY} r={heroR} fill="none" stroke="#fff0d2" strokeWidth="2" opacity="0.8" />
        <circle cx={heroX - heroR * 0.28} cy={heroY - heroR * 0.32} r={heroR * 0.1} fill="#fff7e4" opacity="0.78" />

        {/* Inward pressure darkens the edges, leaving the core readable. */}
        <rect width="1920" height="1080" fill="#02040a" opacity={0.18 + finalPressure * 0.48} mask="url(#collapse-edge-fade)" />
        <rect width="1920" height="1080" fill="#02040a" opacity={finalPressure * 0.34} style={{ mixBlendMode: 'multiply' }} />

        <text
          x="960"
          y="1000"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="13"
          letterSpacing="5"
          fill="#e6dfd1"
          opacity={labelOpacity}
        >
          THE COLLAPSE
        </text>

        {/* Forward handoff cue: a rising pale pressure at frame 330 leads into Choice. */}
        <rect width="1920" height="1080" fill="#eadbbd" opacity={finalPressure * 0.12} />
      </svg>
    </AbsoluteFill>
  );
};

export default Collapse;
