import React, {CSSProperties, ReactNode, useId} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EASE, FPS, HEIGHT, MOTION, TYPE, WIDTH} from './theme';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

/**
 * Frame-driven word entrance/exit atom. `durationInFrames` is the scene-local
 * lifetime; callers must leave the returned text stationary through its reading
 * window before starting the exit.
 */
export type BlurWordProps = {
  text: string;
  startFrame?: number;
  durationInFrames?: number;
  staggerFrames?: number;
  accentWords?: string[];
  fontSize?: number;
  fontWeight?: number;
  style?: CSSProperties;
  wordClassName?: string;
  readingFrames?: number;
};

export const BlurWord: React.FC<BlurWordProps> = ({
  text,
  startFrame = 0,
  durationInFrames = 90,
  staggerFrames = 4,
  accentWords = [],
  fontSize = TYPE.headline,
  fontWeight = TYPE.weightSemibold,
  style,
  wordClassName,
  readingFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const exitStart = Math.max(startFrame + 18 + readingFrames, startFrame + durationInFrames - 12);
  return (
    <span
      aria-label={text}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        columnGap: '0.24em',
        rowGap: '0.12em',
        fontFamily: TYPE.family,
        fontSize,
        fontWeight,
        lineHeight: TYPE.lineHeight,
        letterSpacing: `${TYPE.tracking}em`,
        ...style,
      }}
    >
      {words.map((word, index) => {
        const wordStart = startFrame + index * staggerFrames;
        const enter = EASE.enter(interpolate(frame, [wordStart, wordStart + 18], [0, 1], clamp));
        const exit = EASE.exit(interpolate(frame, [exitStart + index, exitStart + index + 12], [0, 1], clamp));
        const opacity = enter * (1 - exit);
        const blur = mix(18, 0, enter) + 14 * exit;
        const translateY = mix(28, 0, enter) - 18 * exit;
        const scale = mix(0.96, 1, enter) * mix(1, 1.02, exit);
        const accentAmount = EASE.enter(interpolate(frame, [wordStart + 24, wordStart + 34], [0, 1], clamp));
        const isAccent = accentWords.includes(word.replace(/[.,!?]$/, ''));
        const color = isAccent && accentAmount > 0 ? C.mint : C.white;
        return (
          <span
            key={`${word}-${index}`}
            className={wordClassName}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity,
              filter: `blur(${blur.toFixed(2)}px)`,
              transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
              color,
              textShadow: isAccent ? '0 0 24px rgba(59,255,199,.55)' : undefined,
              willChange: 'transform, filter, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

/** Subtle drifting emerald haze, fully derived from the current frame. */
export const Haze: React.FC<{style?: CSSProperties; intensity?: number}> = ({style, intensity = 1}) => {
  const frame = useCurrentFrame();
  const x = 3 * Math.sin((2 * Math.PI * frame) / (8 * FPS));
  const y = 1.2 * Math.sin((2 * Math.PI * frame) / (13 * FPS));
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: C.bg1,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-6%',
          transform: `translate3d(${x}%, ${y}%, 0)`,
          background: 'radial-gradient(60% 80% at 20% 55%, #086A49 0%, #05442F 40%, transparent 75%)',
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(transparent 55%, #001810 100%)',
        }}
      />
    </div>
  );
};

/** Seeded-per-frame SVG grain; repeatable on every render of the same frame. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.03}) => {
  const frame = useCurrentFrame();
  const id = `taskip-grain-${useId().replace(/:/g, '')}`;
  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'soft-light'}}
    >
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed={frame + 1} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={WIDTH} height={HEIGHT} filter={`url(#${id})`} />
    </svg>
  );
};

export type GlassPanelProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  borderRadius?: number;
  /** Optional URL to a pre-blurred background plate when backdrop-filter is unsupported. */
  preBlurredBackground?: string;
};

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  style,
  className,
  borderRadius = 28,
  preBlurredBackground,
}) => {
  const frame = useCurrentFrame();
  const angle = (frame * 2) % 360;
  const sweep = ((frame % 150) / 150) * 140 - 30;
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        borderRadius,
        border: '1.5px solid rgba(131,255,206,.55)',
        background: 'linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.04))',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        boxShadow: '0 0 0 1px rgba(59,255,199,.25), 0 0 40px rgba(59,255,199,.35), inset 0 1px 0 rgba(255,255,255,.55)',
        ...style,
      }}
    >
      {preBlurredBackground ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            zIndex: -1,
            inset: -22,
            backgroundImage: `url(${preBlurredBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(22px)',
            opacity: 0.7,
          }}
        />
      ) : null}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(105deg, transparent ${sweep - 10}%, rgba(255,255,255,.35) ${sweep}%, transparent ${sweep + 10}%)`,
          opacity: 0.45,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: 2,
          pointerEvents: 'none',
          background: `conic-gradient(from ${angle}deg, transparent 0 70%, #83FFCE 85%, transparent 100%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0.8,
        }}
      />
      <div style={{position: 'relative', zIndex: 1, width: '100%', height: '100%'}}>{children}</div>
    </div>
  );
};

export type GlassBubbleProps = {
  children?: ReactNode;
  size?: number;
  style?: CSSProperties;
  className?: string;
  label?: string;
};

export const GlassBubble: React.FC<GlassBubbleProps> = ({children, size = 120, style, className, label}) => (
  <div
    role={label ? 'img' : undefined}
    aria-label={label}
    className={className}
    style={{
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      flex: 'none',
      width: size,
      height: size,
      overflow: 'hidden',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 28% 20%, rgba(255,255,255,.7) 0 8%, transparent 19%), rgba(255,255,255,.96)',
      boxShadow: '0 18px 40px rgba(0,24,16,.45), inset 0 -8px 18px rgba(0,0,0,.08), inset 0 6px 12px rgba(255,255,255,.9)',
      ...style,
    }}
  >
    {children}
  </div>
);

export type ClipRevealShape = 'iris' | 'dome' | 'diagonal' | 'squircle';
export type ClipRevealProps = {
  children: ReactNode;
  shape?: ClipRevealShape;
  startFrame?: number;
  durationInFrames?: number;
  progress?: number;
  style?: CSSProperties;
  className?: string;
};

const pathForReveal = (shape: ClipRevealShape, p: number): string => {
  const t = Math.max(0, Math.min(1, p));
  if (shape === 'iris') {
    const r = Math.SQRT2 * 0.75 * t;
    return `M ${0.5 - r} 0.5 A ${r} ${r} 0 1 0 ${0.5 + r} 0.5 A ${r} ${r} 0 1 0 ${0.5 - r} 0.5 Z`;
  }
  if (shape === 'dome') {
    const rise = t;
    return `M 0 1 Q 0.5 ${1 - 2 * rise} 1 1 L 1 1 L 0 1 Z`;
  }
  if (shape === 'diagonal') {
    const edge = -0.18 + 1.36 * t;
    return `M 0 0 L ${edge} 0 L ${edge - 0.18} 1 L 0 1 Z`;
  }
  const inset = (1 - t) * 0.5;
  const radius = Math.min(0.18 * t, (1 - 2 * inset) / 2);
  const left = inset;
  const right = 1 - inset;
  const top = inset;
  const bottom = 1 - inset;
  return `M ${left + radius} ${top} L ${right - radius} ${top} Q ${right} ${top} ${right} ${top + radius} L ${right} ${bottom - radius} Q ${right} ${bottom} ${right - radius} ${bottom} L ${left + radius} ${bottom} Q ${left} ${bottom} ${left} ${bottom - radius} L ${left} ${top + radius} Q ${left} ${top} ${left + radius} ${top} Z`;
};

/** Frame-driven SVG path clipping for iris, dome, diagonal, and squircle reveals. */
export const ClipReveal: React.FC<ClipRevealProps> = ({
  children,
  shape = 'iris',
  startFrame = 0,
  durationInFrames = 30,
  progress,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const id = `taskip-clip-${useId().replace(/:/g, '')}`;
  const rawProgress = progress ?? interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], clamp);
  const eased = EASE.iris(rawProgress);
  const d = pathForReveal(shape, eased);
  return (
    <div className={className} style={{position: 'relative', width: '100%', height: '100%', ...style, clipPath: `url(#${id})`}}>
      <svg aria-hidden width="0" height="0" style={{position: 'absolute'}}>
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      {children}
    </div>
  );
};

export const Sparkle: React.FC<{size?: number; color?: string; style?: CSSProperties}> = ({size = 36, color = C.mint, style}) => {
  const frame = useCurrentFrame();
  const appear = EASE.enter(interpolate(frame, [0, 12], [0, 1], clamp));
  const pulse = 1 + 0.08 * Math.sin((2 * Math.PI * frame) / 48);
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display: 'block',
        opacity: appear,
        transform: `rotate(${mix(45, 0, appear)}deg) scale(${appear * pulse})`,
        filter: `drop-shadow(0 0 10px ${color})`,
        ...style,
      }}
    >
      <path d="M50 0 C56 36 64 44 100 50 C64 56 56 64 50 100 C44 64 36 56 0 50 C36 44 44 36 50 0Z" fill={color} />
    </svg>
  );
};

/** Utility for callers that need shared canvas dimensions without literals. */
export const useTaskipCanvas = () => {
  const {width, height, fps} = useVideoConfig();
  return {width: width || WIDTH, height: height || HEIGHT, fps: fps || FPS};
};

/** Small layout helper for consistent full-frame scene layers. */
export const fullFrame: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

/** An eased scalar helper for scene-specific frame-driven animation. */
export const easedProgress = (frame: number, from: number, to: number) =>
  EASE.enter(interpolate(frame, [from, to], [0, 1], clamp));

/** A deterministic oscillator suitable for quiet, non-text hold motion. */
export const drift = (frame: number, period: number, amplitude: number, phase = 0) =>
  amplitude * Math.sin((2 * Math.PI * frame) / period + phase);

/** Scene-safe default cutout dimensions for SVG path math. */
export const SVG_VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`;
