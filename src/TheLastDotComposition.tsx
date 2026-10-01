import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import TheLastDotOpening from './TheLastDot';
import WordWorlds from './scenes/WordWorlds';
import Collapse from './scenes/Collapse';
import Choice from './scenes/Choice';
import NewBeginning from './scenes/NewBeginning';

/**
 * The Last Dot — complete 60-second timeline, 1920×1080 at 30 fps.
 *
 * Register this component in a Remotion <Composition> with the exported
 * duration, fps, width, and height constants below. Scene components receive
 * local frame numbers from their Sequence, so each can animate from frame 0.
 * The cuts are contiguous; each scene's own opening/closing motion provides
 * the visual handoff between beats.
 */
export const THE_LAST_DOT_FPS = 30;
export const THE_LAST_DOT_WIDTH = 1920;
export const THE_LAST_DOT_HEIGHT = 1080;
export const THE_LAST_DOT_DURATION_IN_FRAMES = 1800;

const TheLastDotComposition: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#080b12', overflow: 'hidden' }}>
    <Sequence from={0} durationInFrames={450} name="Opening — The Final Sentence">
      <TheLastDotOpening />
    </Sequence>
    <Sequence from={450} durationInFrames={300} name="Worlds of Forgotten Words">
      <WordWorlds />
    </Sequence>
    <Sequence from={750} durationInFrames={330} name="The Collapse">
      <Collapse />
    </Sequence>
    <Sequence from={1080} durationInFrames={330} name="The Choice">
      <Choice />
    </Sequence>
    <Sequence from={1410} durationInFrames={390} name="A New Beginning">
      <NewBeginning />
    </Sequence>
  </AbsoluteFill>
);

export default TheLastDotComposition;
