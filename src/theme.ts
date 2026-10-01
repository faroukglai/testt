/**
 * Taskip Promo — shared design tokens and source-aligned frame timeline.
 *
 * Source timing: 3,963 frames at 60 fps (66.05 seconds). Scene boundaries
 * follow the frame table supplied in the production brief.
 */
import { Easing } from 'remotion';

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 3963;
export const RUNTIME_SECONDS = TOTAL_FRAMES / FPS;

export const C = {
  bg0: '#001810', bg1: '#021B13', bg2: '#032D1F', bg3: '#043122',
  forest1: '#05442F', forest2: '#06573B', forest3: '#075E40', forest4: '#086A49', forest5: '#0A724E',
  emerald: '#0EC779', mintMid: '#11DE99', mint: '#3BFFC7', mintLight: '#83FFCE', mintPale: '#B0FEDE',
  white: '#FFFFFF', uiAccent: '#1BB388', uiBg: '#F5F7F6',
} as const;

export const TYPE = {
  family: 'Inter, Arial, sans-serif', tracking: -0.02, lineHeight: 1.12,
  weightRegular: 400, weightSemibold: 600, weightBold: 700,
  headline: 96, orbitCaption: 40, toolPhrase: 60, catalogHeadline: 84, all: 220, cta: 64,
} as const;

export const SPR = {
  soft: { damping: 22, stiffness: 120, mass: 1 },
  snappy: { damping: 18, stiffness: 220, mass: 0.8 },
  bouncy: { damping: 9, stiffness: 180, mass: 0.9 },
  heavy: { damping: 28, stiffness: 90, mass: 1.4 },
} as const;

export const EASE = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  iris: Easing.bezier(0.76, 0, 0.24, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const MOTION = {
  minEntrance: 20, minShowcase: 30, minSettledHold: 20, groupStagger: 10,
  holdPushPerFrame: 0.00075, maxHoldPush: 0.03, blurEntrancePx: 18, blurExitPx: 14,
} as const;

/** Required reading-time formula; source-accurate short shots may be shorter. */
export const readingFrames = (wordCount: number, fps = FPS): number => {
  if (!Number.isFinite(wordCount) || wordCount < 0) throw new Error(`wordCount must be a non-negative finite number; got ${wordCount}`);
  if (!Number.isFinite(fps) || fps <= 0) throw new Error(`fps must be a positive finite number; got ${fps}`);
  return Math.ceil((wordCount / 3 + 0.5) * fps);
};

export type SceneId =
  | 's01Intro' | 's02Orbit' | 's03Collapse' | 's04ToolList' | 's05WomanCard' | 's06WomanFullscreen'
  | 's07BetterWay' | 's08LogoSphere' | 's09DashboardDome' | 's10DashboardOrbit' | 's11WordCloud'
  | 's12ServicesSidebar' | 's13LeadsTable' | 's14SalesPipeline' | 's15Kanban' | 's16FeatureParade'
  | 's17Workflow' | 's18All' | 's19InOnePlace' | 's20WorkFaster' | 's21Stay' | 's22ClientsHappy' | 's23Cta';

export type CueTag =
  | 'start' | 'entranceEnd' | 'showcaseEnd' | 'readingEnd' | 'holdStart' | 'exitStart' | 'end'
  | 'phraseLeads' | 'phraseProjects' | 'phraseQuotes' | 'phraseDocuments' | 'phraseScheduling'
  | 'phraseEmail' | 'phraseSupport' | 'phraseData' | 'phraseDiscussions'
  | 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'screen5' | 'screen6' | 'screen7' | 'screen8';

export type SceneDefinition = {
  id: SceneId; name: string; duration: number; start: number; end: number; reading: number;
  cues: Partial<Record<CueTag, number>>;
};

type SceneSpec = { id: SceneId; name: string; duration: number; readingWords?: number; showcase?: number };

// Each pair is [start, end), in exact source frames from the supplied timeline.
const specs: SceneSpec[] = [
  { id: 's01Intro', name: 'S1 — Intro headline', duration: 120, readingWords: 5 },
  { id: 's02Orbit', name: 'S2 — Orbit system', duration: 138, readingWords: 4 },
  { id: 's03Collapse', name: 'S3 — Collapse into cluster', duration: 42 },
  { id: 's04ToolList', name: 'S4 — Tool-list loop', duration: 1104 },
  { id: 's05WomanCard', name: 'S5 — Stressed-woman card', duration: 172 },
  { id: 's06WomanFullscreen', name: 'S6 — Fullscreen woman', duration: 130 },
  { id: 's07BetterWay', name: 'S7 — The better way', duration: 154, readingWords: 3 },
  { id: 's08LogoSphere', name: 'S8 — Taskip logo sphere', duration: 120, readingWords: 2 },
  { id: 's09DashboardDome', name: 'S9 — Dashboard dome', duration: 53 },
  { id: 's10DashboardOrbit', name: 'S10 — Dashboard orbit', duration: 78 },
  { id: 's11WordCloud', name: 'S11 — Service catalog word cloud', duration: 168, readingWords: 4 },
  { id: 's12ServicesSidebar', name: 'S12 — Services sidebar', duration: 178, readingWords: 6 },
  { id: 's13LeadsTable', name: 'S13 — Leads table', duration: 63, readingWords: 4 },
  { id: 's14SalesPipeline', name: 'S14 — Sales Pipeline title', duration: 60, readingWords: 2 },
  { id: 's15Kanban', name: 'S15 — Kanban board', duration: 155 },
  { id: 's16FeatureParade', name: 'S16 — Feature screen parade', duration: 625 },
  { id: 's17Workflow', name: 'S17 — Workflow builder', duration: 60, readingWords: 3 },
  { id: 's18All', name: 'S18 — All', duration: 60, readingWords: 1 },
  { id: 's19InOnePlace', name: 'S19 — In One Place', duration: 60, readingWords: 3 },
  { id: 's20WorkFaster', name: 'S20 — Work faster', duration: 60, readingWords: 2 },
  { id: 's21Stay', name: 'S21 — Stay', duration: 60, readingWords: 1 },
  { id: 's22ClientsHappy', name: 'S22 — Keep clients happy', duration: 120, readingWords: 3 },
  { id: 's23Cta', name: 'S23 — CTA', duration: 183, readingWords: 4 },
];

const makeGenericCues = (duration: number, reading: number, showcase: number) => {
  const entranceEnd = Math.min(MOTION.minEntrance, duration);
  const showcaseEnd = Math.min(duration, entranceEnd + Math.max(MOTION.minShowcase, showcase));
  const readingEnd = Math.min(duration, entranceEnd + reading);
  const holdStart = Math.min(duration, Math.max(showcaseEnd, readingEnd));
  const exitStart = Math.min(duration, holdStart + MOTION.minSettledHold);
  return { start: 0, entranceEnd, showcaseEnd, readingEnd, holdStart, exitStart, end: duration } satisfies Partial<Record<CueTag, number>>;
};

let cursor = 0;
const sceneList: SceneDefinition[] = specs.map((spec) => {
  const start = cursor;
  const reading = spec.readingWords ? readingFrames(spec.readingWords) : 0;
  const scene: SceneDefinition = {
    id: spec.id, name: spec.name, duration: spec.duration, start, end: start + spec.duration,
    reading, cues: makeGenericCues(spec.duration, reading, spec.showcase ?? MOTION.minShowcase),
  };
  cursor = scene.end;
  return scene;
});

/** Exact S4 phrase starts are scene-local offsets from the source frame table. */
const toolPhraseStarts = [
  { tag: 'phraseLeads', name: 'Leads and Sales Pipelines', text: 'Leads and Sales Pipelines', words: 4, start: 0 },
  { tag: 'phraseProjects', name: 'Projects and Tasks', text: 'Projects and Tasks', words: 3, start: 120 },
  { tag: 'phraseQuotes', name: 'Quotes and Invoices', text: 'Quotes and Invoices', words: 3, start: 240 },
  { tag: 'phraseDocuments', name: 'Documents and File Storage', text: 'Documents and File Storage', words: 4, start: 420 },
  { tag: 'phraseScheduling', name: 'Scheduling Meetings', text: 'Scheduling Meetings', words: 2, start: 600 },
  { tag: 'phraseEmail', name: 'Email', text: 'Email', words: 1, start: 660 },
  { tag: 'phraseSupport', name: 'Support', text: 'Support', words: 1, start: 780 },
  { tag: 'phraseData', name: 'Collect Data', text: 'Collect Data', words: 2, start: 840 },
  { tag: 'phraseDiscussions', name: 'Team discussions', text: 'Team discussions', words: 2, start: 1020 },
] as const;
const toolScene = sceneList.find((scene) => scene.id === 's04ToolList');
if (!toolScene) throw new Error('Timeline is missing S4 tool-list scene');
for (const phrase of toolPhraseStarts) {
  if (phrase.start < 0 || phrase.start >= toolScene.duration) throw new Error(`S4 phrase "${phrase.name}" starts outside S4`);
  toolScene.cues[phrase.tag] = phrase.start;
}
export const TOOL_PHRASES = toolPhraseStarts.map((phrase, index) => ({
  ...phrase,
  duration: (toolPhraseStarts[index + 1]?.start ?? toolScene.duration) - phrase.start,
}));

/** S16 screen cues are scene-local and evenly spaced; screen 8 remains in range. */
const paradeScene = sceneList.find((scene) => scene.id === 's16FeatureParade');
if (!paradeScene) throw new Error('Timeline is missing S16 feature parade');
const screenStep = 76;
for (let i = 0; i < 8; i++) paradeScene.cues[`screen${i + 1}` as CueTag] = i * screenStep;

export const SCENES = Object.fromEntries(sceneList.map((scene) => [scene.id, scene])) as Record<SceneId, SceneDefinition>;
export const SCENE_ORDER = sceneList.map(({ id }) => id) as SceneId[];
export const SCENE_LIST = sceneList;

/** Return a cue offset in scene-local frame space. */
export const cue = (sceneId: SceneId, tag: CueTag): number => {
  const scene = SCENES[sceneId];
  const value = scene?.cues[tag];
  if (value === undefined) throw new Error(`Unknown cue "${tag}" in scene "${sceneId}"`);
  if (value < 0 || value > scene.duration) throw new Error(`Cue "${tag}" (${value}) is outside ${sceneId} duration (${scene.duration})`);
  return value;
};

/** Convert a scene-local cue into an absolute master-timeline frame. */
export const absoluteCue = (sceneId: SceneId, tag: CueTag): number => SCENES[sceneId].start + cue(sceneId, tag);

/** Find the scene containing an absolute frame; the final frame is exclusive. */
export const sceneAtFrame = (frame: number): SceneDefinition => {
  if (!Number.isInteger(frame) || frame < 0 || frame >= TOTAL_FRAMES) throw new Error(`Frame ${frame} is outside the timeline [0, ${TOTAL_FRAMES})`);
  const scene = sceneList.find(({ start, end }) => frame >= start && frame < end);
  if (!scene) throw new Error(`No scene covers frame ${frame}`);
  return scene;
};

/** Validate frame coverage and cue bounds at module load. */
export const validateTimeline = (): true => {
  if (cursor !== TOTAL_FRAMES) throw new Error(`Scene timeline totals ${cursor} frames; expected ${TOTAL_FRAMES}`);
  let expectedStart = 0;
  for (const scene of sceneList) {
    if (scene.start !== expectedStart || scene.end - scene.start !== scene.duration) throw new Error(`Invalid frame range for ${scene.id}`);
    for (const [tag, frame] of Object.entries(scene.cues)) {
      if (!Number.isInteger(frame) || frame < 0 || frame > scene.duration) throw new Error(`Cue ${scene.id}.${tag}=${frame} falls outside its scene`);
    }
    expectedStart = scene.end;
  }
  return true;
};
validateTimeline();
