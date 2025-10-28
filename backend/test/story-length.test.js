const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateStorySegment,
  finalizeIfComplete,
  STORY_LENGTH_TURNS,
  STORY_PREMISES,
  createInitialState,
  createIntroSegment,
} = require('../src/index.js');
const { aiConfig } = require('../src/config.js');

const skip = !aiConfig.enabled || process.env.ENABLE_LIVE_STORY_TESTS !== 'true';

async function playThrough(theme, length) {
  const maxTurns = STORY_LENGTH_TURNS[length];
  if (!maxTurns) {
    throw new Error(`Unknown length: ${length}`);
  }

const session = {
  theme,
  length,
  turn: 1,
  maxTurns,
  status: 'in-progress',
  state: createInitialState(),
  premise: STORY_PREMISES[theme][length],
  log: [],
  progress: 0,
  keyPoints: [],
  pendingThreads: [],
  tone: '測試',
};

  let includePremise = true;
  let action = {
    raw: 'SYSTEM_START',
    resolved: '故事開始',
    id: null,
    type: 'system',
    intent: 'system',
  };

  while (session.status !== 'completed') {
    if (session.theme === 'detective') {
      throw new Error('Tests should not invoke detective story generation directly');
    }
    const segment = await generateStorySegment({
      theme: session.theme,
      length: session.length,
      turn: session.turn,
      previousStory: session.log,
      maxTurns: session.maxTurns,
      state: session.state,
      premise: session.premise,
      userAction: action,
      includePremise,
      progress: session.progress,
      keyPoints: session.keyPoints,
      pendingThreads: session.pendingThreads,
      tone: session.tone,
    });

    session.state = segment.state;

    session.log.push({
      turn: session.turn,
      narrative: segment.narrative,
      options: segment.options,
      display: segment.display,
      actionRaw: action.raw,
      actionResolved: action.resolved,
      actionId: action.id,
      actionType: action.type,
      actionIntent: action.intent,
      state: segment.state,
      stateDelta: segment.stateDelta,
      status: segment.status,
      endingTrigger: segment.endingTrigger,
      ai: segment.ai,
      progress: segment.progress,
      keyPoints: segment.keyPoints,
      pendingThreads: segment.pendingThreads,
      tone: segment.tone,
    });

    session.turn = segment.nextTurn;
    session.progress = segment.progress ?? session.progress;
    session.keyPoints = Array.isArray(segment.keyPoints) ? segment.keyPoints : session.keyPoints;
    session.pendingThreads = Array.isArray(segment.pendingThreads) ? segment.pendingThreads : session.pendingThreads;
    session.tone = segment.tone || session.tone;
    includePremise = false;
    finalizeIfComplete(session);

    if (session.status !== 'completed') {
      const firstOption = segment.ai.options?.[0];
      if (firstOption) {
        action = {
          raw: firstOption.id,
          resolved: firstOption.text,
          id: firstOption.id,
          type: 'option',
          intent: 'follow_up',
        };
      } else {
        action = {
          raw: '我選擇繼續推進',
          resolved: '我選擇繼續推進',
          id: null,
          type: 'custom',
          intent: 'follow_up',
        };
      }
    }
  }

  return session.log;
}

test('intro segment includes expected sections and options', { skip }, async () => {
  const log = await playThrough('wuxia', 'short');
  const intro = log[0];

  assert.match(intro.narrative, /╔════════ 進度/);
  assert.ok(!intro.narrative.includes('"progress"'));
  assert.strictEqual(intro.playerAction, '故事開始');
  assert.strictEqual(intro.options.length, 3);
  assert.ok(intro.memorySummary);
});

test('final segment ends story without options', { skip }, async () => {
  const log = await playThrough('wuxia', 'medium');
  const finalSegment = log[log.length - 1];

  assert.strictEqual(finalSegment.status, 'ended');
  assert.strictEqual(finalSegment.options.length, 0);
  assert.match(finalSegment.narrative, /╔════════ 進度/);
  assert.ok(finalSegment.narrative.includes('【結局】'));
  assert.ok(!finalSegment.narrative.includes('"progress"'));
});

test('createIntroSegment produces immediate local scene', () => {
  const premise = STORY_PREMISES.wuxia.short;
  const state = createInitialState();
  const intro = createIntroSegment({
    theme: 'wuxia',
    turn: 1,
    state,
    premise,
    maxTurns: STORY_LENGTH_TURNS.short,
  });

  assert.strictEqual(intro.status, 'ongoing');
  assert.strictEqual(intro.options.length, 3);
  assert.match(intro.narrative, /╔════════ 進度/);
  assert.strictEqual(intro.playerAction, '故事開始');
  assert.ok(intro.memorySummary);
});
