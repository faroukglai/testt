import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Act1} from './Act1';
import {Act2} from './Act2';
import {Act3} from './Act3';
import {Act4} from './Act4';
import {C, SCENES, TOTAL_FRAMES} from './theme';

const ACTS = [
  {
    id: 'act1',
    from: SCENES.s01Intro.start,
    duration: SCENES.s04ToolList.end - SCENES.s01Intro.start,
    Component: Act1,
  },
  {
    id: 'act2',
    from: SCENES.s05WomanCard.start,
    duration: SCENES.s10DashboardOrbit.end - SCENES.s05WomanCard.start,
    Component: Act2,
  },
  {
    id: 'act3',
    from: SCENES.s11WordCloud.start,
    duration: SCENES.s16FeatureParade.end - SCENES.s11WordCloud.start,
    Component: Act3,
  },
  {
    id: 'act4',
    from: SCENES.s17Workflow.start,
    duration: SCENES.s23Cta.end - SCENES.s17Workflow.start,
    Component: Act4,
  },
] as const;

const coveredFrames = ACTS.reduce((sum, act) => sum + act.duration, 0);
if (coveredFrames !== TOTAL_FRAMES) {
  throw new Error(`Act timeline covers ${coveredFrames} frames; expected ${TOTAL_FRAMES}`);
}

/**
 * Master 1920×1080 scene composition.
 * Each Act is placed at its source-derived absolute boundary; its inner
 * Sequence components receive local frame zero as designed.
 */
export const TaskipPromo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg0, overflow: 'hidden'}}>
    {ACTS.map(({id, from, duration, Component}) => (
      <Sequence key={id} from={from} durationInFrames={duration} layout="none">
        <Component />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export default TaskipPromo;
