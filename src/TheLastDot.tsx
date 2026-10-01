import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * The Last Dot — opening animatic
 *
 * A self-contained 15-second, 30 fps Remotion composition (450 frames).
 * No external assets are required. Register this component in your Remotion
 * Root with a 1920x1080 canvas and 450-frame duration.
 */
const FPS = 30;
const DURATION = 15 * FPS;
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const easeInOut = Easing.bezier(0.76, 0, 0.24, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const TheLastDot: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = Math.min(frame, DURATION);

  // The page recedes and folds away as the punctuation mark leaves its world.
  const pageScale = interpolate(t, [0, 205, 310, 450], [1, 1, 1.48, 2.9], {
    ...clamp,
    easing: easeInOut,
  });
  const pageY = interpolate(t, [205, 310, 450], [0, 35, 250], {
    ...clamp,
    easing: easeInOut,
  });
  const pageOpacity = interpolate(t, [0, 285, 365, 450], [1, 1, 0.75, 0.08], clamp);

  // Type arrives with a deliberate, readable cadence, then the full sentence holds.
  const sentenceProgress = interpolate(t, [12, 108], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const sentenceWidth = sentenceProgress * 1110;
  const inkOpacity = interpolate(t, [0, 12, 24], [0, 0.92, 1], clamp);

  // The final period drops from the baseline, then becomes a small planet.
  const fall = interpolate(t, [176, 265], [0, 555], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const heroScale = interpolate(t, [265, 345, 450], [1, 22, 132], {
    ...clamp,
    easing: easeInOut,
  });
  const heroX = interpolate(t, [176, 265, 450], [1120, 1120, 960], {
    ...clamp,
    easing: easeInOut,
  });
  const heroY = interpolate(t, [176, 265, 450], [531, 825, 600], {
    ...clamp,
    easing: easeInOut,
  });
  const impact = interpolate(t, [258, 270, 300, 450], [0, 1, 0, 0], clamp);
  const starReveal = interpolate(t, [298, 355, 450], [0, 0.4, 1], clamp);
  const vignette = interpolate(t, [0, 210, 350, 450], [0.28, 0.3, 0.55, 0.82], clamp);

  const stars = Array.from({ length: 46 }, (_, index) => {
    // Fixed arithmetic (not Math.random) keeps every rendered frame deterministic.
    const x = (index * 197 + 43) % 1920;
    const y = (index * 311 + 71) % 1080;
    const r = 1 + ((index * 13) % 3) * 0.55;
    const phase = (index * 17) % 90;
    const twinkle = 0.25 + 0.75 * Math.abs(Math.sin((t + phase) / 34));
    return { x, y, r, opacity: starReveal * twinkle * 0.75 };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080b12',
        color: '#171716',
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A final period falls from a sentence and becomes a planet in a paper universe."
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4ead5" />
            <stop offset="0.53" stopColor="#e8dcc2" />
            <stop offset="1" stopColor="#cfc2a7" />
          </linearGradient>
          <radialGradient id="planet" cx="34%" cy="28%" r="74%">
            <stop offset="0" stopColor="#fff3d4" />
            <stop offset="0.2" stopColor="#d8c49e" />
            <stop offset="0.62" stopColor="#77869a" />
            <stop offset="1" stopColor="#1a2435" />
          </radialGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#f7e5bb" stopOpacity="0.95" />
            <stop offset="0.32" stopColor="#b8c9e8" stopOpacity="0.26" />
            <stop offset="1" stopColor="#7d99c5" stopOpacity="0" />
          </radialGradient>
          <filter id="paperTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="monoNoise"
            />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.08" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" />
          </filter>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <clipPath id="typedLine">
            <rect x="0" y="0" width={sentenceWidth} height="110" />
          </clipPath>
        </defs>

        {/* Deep space is present from the start, so the final reveal feels motivated. */}
        <rect width="1920" height="1080" fill="#080b12" />
        {stars.map((star, index) => (
          <circle
            key={index}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#dce6f5"
            opacity={star.opacity}
          />
        ))}

        {/* Paper page: its scale-up becomes the camera's dive into its grain. */}
        <g transform={`translate(960 ${540 + pageY}) scale(${pageScale}) translate(-960 -540)`} opacity={pageOpacity}>
          <rect x="225" y="160" width="1470" height="760" rx="3" fill="#080b12" opacity="0.44" />
          <rect
            x="205"
            y="135"
            width="1510"
            height="770"
            fill="url(#paper)"
            filter="url(#paperTexture)"
          />
          <path d="M205 135H1715" stroke="#fff9e9" strokeWidth="5" opacity="0.5" />
          <path d="M205 904H1715" stroke="#766c5c" strokeWidth="3" opacity="0.25" />
          <path d="M1710 135V905" stroke="#8d826f" strokeWidth="2" opacity="0.22" />

          {/* The line reveals like a measured typesetting pass. */}
          <g opacity={inkOpacity} clipPath="url(#typedLine)">
            <text
              x="402"
              y="548"
              fontSize="67"
              letterSpacing="-1.7"
              fill="#24221f"
            >
              The last sentence ended
            </text>
          </g>
          <text
            x="1126"
            y="548"
            fontSize="73"
            fill="#171614"
            opacity={t > 94 ? 1 : 0}
          >
            .
          </text>

          {/* Hairline fold guides foreshadow the origami-world transition. */}
          <path d="M205 135L355 285M1715 135L1565 285" stroke="#fff8e8" strokeWidth="2" opacity={interpolate(t, [185, 255], [0, 0.48], clamp)} />
          <path d="M205 905L355 755M1715 905L1565 755" stroke="#716856" strokeWidth="2" opacity={interpolate(t, [185, 255], [0, 0.35], clamp)} />
        </g>

        {/* Impact ripple stays behind the hero punctuation. */}
        <circle
          cx={heroX}
          cy={heroY}
          r={interpolate(t, [258, 300], [12, 240], { ...clamp, easing: easeOut })}
          fill="none"
          stroke="#eadbb9"
          strokeWidth="3"
          opacity={impact * 0.65}
        />
        <circle cx={heroX} cy={heroY} r={heroScale * 1.5} fill="url(#glow)" opacity={starReveal} />
        <circle
          cx={heroX}
          cy={heroY}
          r={heroScale}
          fill={t < 298 ? '#191815' : 'url(#planet)'}
          style={{ filter: t < 298 ? 'none' : 'drop-shadow(0 0 42px rgba(188, 207, 239, 0.3))' }}
        />

        {/* Fine orbit arc ties the falling punctuation to its new planetary scale. */}
        <path
          d={`M ${heroX - heroScale * 1.8} ${heroY + heroScale * 0.35} Q ${heroX} ${heroY - heroScale * 1.5} ${heroX + heroScale * 1.8} ${heroY + heroScale * 0.2}`}
          fill="none"
          stroke="#d7dff0"
          strokeWidth={Math.max(1, heroScale * 0.018)}
          opacity={interpolate(t, [310, 370, 450], [0, 0.25, 0.58], clamp)}
        />

        {/* Atmospheric edge darkening keeps the eye on the transforming dot. */}
        <rect width="1920" height="1080" fill="#05070c" opacity={vignette} style={{ mixBlendMode: 'multiply' }} />

        {/* A small, restrained caption anchors the otherwise wordless scale shift. */}
        <text
          x="960"
          y="1000"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="15"
          letterSpacing="5"
          fill="#e7dfd0"
          opacity={interpolate(t, [340, 390, 450], [0, 0.48, 0.48], clamp)}
        >
          THE LAST DOT
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export default TheLastDot;
