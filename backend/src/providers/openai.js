let OpenAI;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  OpenAI = require('openai');
} catch (error) {
  OpenAI = null;
}

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.7;

function logUsage(context, usage) {
  if (!usage) {
    return;
  }
  const prompt = usage.prompt_tokens ?? usage.input_tokens;
  const completion = usage.completion_tokens ?? usage.output_tokens;
  const total = usage.total_tokens ?? (prompt || 0) + (completion || 0);
  console.info(`[OpenAI][${context}] tokens - prompt:${prompt ?? 'n/a'} completion:${completion ?? 'n/a'} total:${total}`);
}

const SYSTEM_INSTRUCTIONS = [
  '你是一個「互動故事生成引擎」，負責根據玩家輸入與當前遊戲狀態，自動生成不同的劇情分支與結局。',
  '請嚴格遵守以下規則：',
  '1. 使用提供的前情提要 (premise) 與 theme_profile 描述設定，維持世界觀、角色、衝突與節奏。',
  '2. 每段輸出 3~6 句敘述性 scene_lines，需明確回應 player_action 的內容，並包含具象動作、情緒台詞、主角內心描寫來帶出指定節奏。',
  '3. 當 status 為 "ongoing" 時提供 3 個互斥行動選項 (A/B/C)；結局時 (status = "ended") options 必須為空陣列、free_hint 可留空。',
  '4. 以 Traditional Chinese 輸出，語氣符合作品風格：武俠=詩意俠骨、偵探=緊湊理性、末日=壓迫感強、校園=柔光抒情。',
  '5. 更新 state：player_trust、clue_progress、danger_level (0~100)。state.delta 為變化量，state.value 為當前值，並以 turn_summary 摘要玩家行動造成的影響。',
  '6. metadata.forceEnding 或 turn == maxTurns 時必須立即收束：status = "ended"、ending_summary 為 5~8 句完整結局、options 為空。',
  '7. ending_trigger 只能取 null、"trust"、"clue" 或 "danger"，呼應三項狀態門檻。',
  '8. 僅輸出單一 JSON，結構為：',
  '{',
  '  "status": "ongoing" | "ended",',
  '  "scene": string[],',
  '  "options": [{"id": "A" | "B" | "C", "text": string}],',
  '  "free_hint": string,',
  '  "state": {',
  '    "player_trust": {"value": number, "delta": number},',
  '    "clue_progress": {"value": number, "delta": number},',
  '    "danger_level": {"value": number, "delta": number}',
  '  },',
  '  "ending_trigger": null | "trust" | "clue" | "danger",',
  '  "ending_summary": string | null,',
  '  "turn_summary": string,',
  '  "last_action_summary": string',
  '}',
  '9. 每段 progress 必須增加 5~25%，不得倒退；progress < 90% 時禁止輸出結局或收束語氣。',
  '10. 玩家行動需要立刻帶來具體後果（動作、對話、場景變化），並在 last_action_summary 中精準總結行動結果，避免延遲至下一段。',
  '11. 與上一段相比需呈現時間或場景上的新變化；若仍在同地點，必須帶出明顯新的情緒層次或事件。',
  '12. memory_summary 必須更新且反映最新事件與情感，不得與上一段相同；pending_threads 要移除已解決線索並視需求加入新懸念。',
  '13. 當 status = "ongoing" 時務必提供三個全新選項，避免與上一段重複或留白。',
  '14. 請務必輸出 last_action_summary，一句話描述目前玩家行動「已被執行後」所造成的即時結果（包含環境變化、角色反應或情緒轉折）；若只是重複上一段或重述行動本身，視為錯誤輸出。',
  '15. 若故事中角色尚未具名，請立即賦予自然、易辨識的中文名字並保持一致，避免以「青梅竹馬」「學長」等泛稱反覆代替。',
  '偵探推理主題會使用專屬指令與格式，請於該主題遵循額外規範。',
].join('\n');

const DETECTIVE_BLUEPRINT_INSTRUCTIONS = [
  '你是「互動辦案引擎」。任務是依據提供的前提與主題設定建立完整的案件藍本。',
  '請輸出 JSON，結構如下：',
  '{',
  '  "case": {',
  '    "case_id": string,',
  '    "setting": string,',
  '    "victim": { "name": string, "occupation": string, "cause_of_death": string, "time_of_death": string },',
  '    "crime_scene": string,',
  '    "timeline": { "before": string, "during": string, "after": string },',
  '    "suspects": [',
  '      { "name": string, "relation_to_victim": string, "motive": string, "means": string, "opportunity": string, "alibi": string } ... 至少三人',
  '    ],',
  '    "initial_evidence": [{ "id": string, "type": string, "detail": string }... 至少三件],',
  '    "red_herrings": [{ "id": string, "detail": string }... 1~2 件],',
  '    "twist": string,',
  '    "resolution_rule": string',
  '  }',
  '}',
  '所有欄位必填且需彼此一致，語言使用繁體中文。不要輸出額外文字。',
].join('\n');

const DETECTIVE_TURN_INSTRUCTIONS = [
  '你是「互動辦案引擎」。根據案件藍本與目前調查狀態，回應玩家行動並新增一條可驗證的查證事實。',
  '每段僅新增一條查證事實，並更新推論與嫌疑分。請輸出 JSON：',
  '{',
  '  "status": "ongoing" | "ended",',
  '  "scene_lines": string[],',
  '  "one_hard_fact": string,',
  '  "evidence_chain_delta": string,',
  '  "working_theory": string,',
  '  "knowledge_base": string[],',
  '  "next_actions": [{"id": "A" | "B" | "C", "text": string, "intent": "interrogate" | "examine" | "analyze" | "follow_up" }],',
  '  "choice_prompt": string,',
  '  "json_state_update": {',
  '    "clue_progress": {"value": number, "delta": number},',
  '    "suspicion_scores": { "suspect_name": number, ... },',
  '    "time_remaining": number,',
  '    "contradictions": string[],',
  '    "found_evidence": string[]',
  '  },',
  '  "ending_payload": {',
  '    "culprit": string,',
  '    "motive": string,',
  '    "method": string,',
  '    "opportunity": string,',
  '    "evidence_chain": string[],',
  '    "twist_explained": string,',
  '    "epilogue": string[]',
  '  } | null,',
  '  "last_action_summary": string',
  '}',
  '規則：',
  '1. one_hard_fact 必須是可驗證事實 (鑑識結果、監視器時間、證人供詞有證)。',
  '2. scene_lines 必須明確回應玩家本段的行動或推論，說明其帶來的影響或被推翻之處。',
  '3. evidence_chain_delta 說明這條事實如何接到既有證據。',
  '4. working_theory 需根據查證事實與玩家行動調整方向。',
  '5. knowledge_base 維持 3~6 條，包含最新查證事實、被推翻的偽線索，以及玩家剛才的行動結果。',
  '6. json_state_update 要同步調整 clue_progress、time_remaining，以及所有嫌疑人的 suspicion_scores。',
  '7. 當結局條件成立 (clue_progress ≥ 100 且證據鏈完整、或僅剩一名嫌疑人疑點>80 且動機+手法+機會皆成立)，status 設為 "ended" 並填寫 ending_payload；此時 next_actions 可為空陣列。',
  '8. 若尚未結案，ending_payload 必須為 null。',
  '9. 每段應讓 progress 或 clue_progress 以前一狀態為基準推進 5~25，避免停滯或倒退；progress < 90% 時不得提前結案。',
  '10. 玩家行動需在場景中立即引發具體影響，並以 last_action_summary 精準描述後果；若張力不足請主動帶入矛盾、風險或情感變化。',
  '11. 與上一段相比需帶出時間或場景的延展，或呈現新的情緒與推理進展。',
  '12. memory_summary 與 pending_threads 需同步更新，避免與上一段重複並保留尚未解決的線索。',
  '13. last_action_summary 必須存在且為一句話概述玩家當前行動的即時後果，遺漏視為輸出錯誤。',
  '語言使用繁體中文，場景筆觸可以帶有緊湊懸疑氛圍。不要輸出額外文字。',
].join('\n');

function createOpenAIProvider(config = {}) {
  if (!OpenAI) {
    console.warn('openai package is not installed. Skipping OpenAI provider initialisation.');
    return null;
  }

  const apiKey = config.apiKey || '';
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is missing. Skipping OpenAI provider initialisation.');
    return null;
  }

  const clientOptions = { apiKey };
  if (config.baseUrl) {
    clientOptions.baseURL = config.baseUrl;
  }

  let client;
  try {
    client = new OpenAI(clientOptions);
  } catch (error) {
    console.warn('Failed to create OpenAI client:', error);
    return null;
  }

  const model = config.model || DEFAULT_MODEL;
  const temperature = Number.isFinite(config.temperature)
    ? config.temperature
    : DEFAULT_TEMPERATURE;
  const maxTokens = Number.isFinite(config.maxTokens) ? config.maxTokens : undefined;

  async function generate(payload) {
    if (payload && payload.theme === 'detective') {
      return generateDetectiveTurn(payload, { client, model, temperature, maxTokens });
    }

    const userPrompt = buildUserPrompt(payload);

    const request = {
      model,
      temperature,
      input: [
        { role: 'system', content: SYSTEM_INSTRUCTIONS },
        { role: 'user', content: JSON.stringify(userPrompt, null, 2) },
      ],
    };

    if (maxTokens) {
      request.max_output_tokens = maxTokens;
    }

    const completion = await client.responses.create(request);
    logUsage('story', completion?.usage);
    const rawContent = completion?.output_text || '';
    const jsonText = extractJson(rawContent);
    const parsed = JSON.parse(jsonText);
    if (completion?.usage) {
      parsed.__usage = completion.usage;
    }
    if (parsed && typeof parsed === 'object' && !parsed.last_action_summary) {
      const resolvedAction = payload?.userAction?.resolved || payload?.userAction?.raw || '';
      if (resolvedAction) {
        parsed.last_action_summary = `玩家行動「${resolvedAction}」已產生直接後果。`;
      }
    }
    return parsed;
  }

  async function generateDetectiveBlueprint(payload) {
    const request = {
      model,
      temperature,
      input: [
        { role: 'system', content: DETECTIVE_BLUEPRINT_INSTRUCTIONS },
        { role: 'user', content: JSON.stringify(payload, null, 2) },
      ],
    };

    if (maxTokens) {
      request.max_output_tokens = maxTokens;
    }

    const completion = await client.responses.create(request);
    logUsage('detective-blueprint', completion?.usage);
    const rawContent = completion?.output_text || '';
    const jsonText = extractJson(rawContent);
    const parsed = JSON.parse(jsonText);
    if (completion?.usage) {
      parsed.__usage = completion.usage;
    }
    return parsed;
  }

  return {
    generate,
    generateDetectiveBlueprint,
  };
}

async function generateDetectiveTurn(payload, clientConfig) {
  const { client, model, temperature, maxTokens } = clientConfig;
  const request = {
    model,
    temperature,
    input: [
      { role: 'system', content: DETECTIVE_TURN_INSTRUCTIONS },
      { role: 'user', content: JSON.stringify(buildDetectivePrompt(payload), null, 2) },
    ],
  };

  if (maxTokens) {
    request.max_output_tokens = maxTokens;
  }

  const completion = await client.responses.create(request);
  logUsage('detective-turn', completion?.usage);
  const rawContent = completion?.output_text || '';
  const jsonText = extractJson(rawContent);
  const parsed = JSON.parse(jsonText);
  if (completion?.usage) {
    parsed.__usage = completion.usage;
  }
  if (parsed && typeof parsed === 'object' && !parsed.last_action_summary) {
    const resolvedAction = payload?.userAction?.resolved || payload?.userAction?.raw || '';
    if (resolvedAction) {
      parsed.last_action_summary = `玩家行動「${resolvedAction}」已產生直接後果。`;
    }
  }
  return parsed;
}

function buildUserPrompt(payload = {}) {
  const {
    theme,
    length,
    turn,
    maxTurns,
    progress,
    keyPoints,
    pendingThreads,
    tone,
    premise,
    state,
    history,
    userAction,
    includePremise,
    forceEnding,
    forceEndingRetry,
    themeProfile,
    sceneShiftRequired,
    overlapReference,
    forceActionRetry,
    memorySummary: currentMemorySummary = '',
    previousLastActionSummary = '',
    gender = 'male',
  } = payload;

  const remainingTurns = Number.isFinite(maxTurns) && Number.isFinite(turn)
    ? Math.max(maxTurns - turn, 0)
    : null;

  const overlapGuard = overlapReference
    ? {
      previous_key_points: Array.isArray(overlapReference.previousKeyPoints)
        ? overlapReference.previousKeyPoints
        : [],
      previous_pending_threads: Array.isArray(overlapReference.previousPendingThreads)
        ? overlapReference.previousPendingThreads
        : [],
      previous_memory_summary: overlapReference.previousMemorySummary || '',
      previous_last_action_summary: overlapReference.previousLastActionSummary || previousLastActionSummary || '',
    }
    : (previousLastActionSummary
      ? {
        previous_key_points: [],
        previous_pending_threads: [],
        previous_memory_summary: '',
        previous_last_action_summary: previousLastActionSummary,
      }
      : null);

  const basePrompt = {
    metadata: {
      theme,
      length,
      turn,
      maxTurns,
      remainingTurns,
      progress,
      tone,
      includePremise: Boolean(includePremise),
      forceEnding: Boolean(forceEnding),
      forceEndingRetry: Boolean(forceEndingRetry),
      scene_shift_required: Boolean(sceneShiftRequired),
      action_requires_immediate_resolution: true,
      force_action_retry: Boolean(forceActionRetry),
      previous_last_action_summary: overlapGuard?.previous_last_action_summary || previousLastActionSummary || '',
      player_gender: gender === 'female' ? 'female' : 'male',
    },
    theme_profile: themeProfile || null,
    premise,
    current_state: {
      progress,
      key_points: Array.isArray(keyPoints) ? keyPoints : [],
      pending_threads: Array.isArray(pendingThreads) ? pendingThreads : [],
      tone: tone || '',
      memory_summary: clipMemorySummary(currentMemorySummary) || '',
    },
    state_before: convertStateForAi(state),
    history: Array.isArray(history) ? history.slice(-2).map(normalizeHistoryEntry) : [],
    overlap_guard: overlapGuard,
    player_profile: {
      gender: gender === 'female' ? 'female' : 'male',
      pronoun: gender === 'female' ? '她' : '他',
      perspective: gender === 'female' ? '以女性第一人稱敘述' : '以男性第一人稱敘述',
    },
  };

  return {
    ...basePrompt,
    player_action: sanitizeUserAction(userAction),
  };
}

function sanitizeUserAction(action = {}) {
  return {
    raw: action.raw || '',
    resolved: action.resolved || '',
    id: action.id || null,
    type: action.type || 'custom',
    intent: action.intent || null,
  };
}

function clipMemorySummary(text = '') {
  const trimmed = String(text || '').trim();
  if (trimmed.length <= 120) {
    return trimmed;
  }
  return `${trimmed.slice(0, 117)}…`;
}

function normalizeHistoryEntry(entry = {}) {
  return {
    status: entry.status,
    ending_trigger: entry.ending_trigger || entry.endingTrigger || null,
    scene: Array.isArray(entry.scene) ? entry.scene.slice(0, 2) : [],
    state_after: convertStateForAi(entry.state_after || entry.stateAfter),
    player_action: sanitizeUserAction(entry.player_action || entry.playerAction),
    turn_summary: entry.turn_summary || entry.turnSummary || '',
    progress: entry.progress || null,
    key_points: Array.isArray(entry.key_points) ? entry.key_points : [],
    pending_threads: Array.isArray(entry.pending_threads) ? entry.pending_threads : [],
    tone: entry.tone || '',
    memory_summary: entry.memory_summary || entry.memorySummary || '',
    last_action_summary: entry.last_action_summary || entry.lastActionSummary || '',
  };
}

function buildDetectivePrompt(payload = {}) {
  const {
    detectiveCase,
    investigationState,
    detectiveHistory,
    userAction,
    forceEnding,
    forceEndingRetry,
    sceneShiftRequired,
    overlapReference,
    forceActionRetry,
    turn,
    maxTurns,
    memorySummary: currentMemorySummary = '',
    previousLastActionSummary = '',
    gender = 'male',
  } = payload;

  const overlapGuard = overlapReference
    ? {
      previous_key_points: Array.isArray(overlapReference.previousKeyPoints)
        ? overlapReference.previousKeyPoints
        : [],
      previous_pending_threads: Array.isArray(overlapReference.previousPendingThreads)
        ? overlapReference.previousPendingThreads
        : [],
      previous_memory_summary: overlapReference.previousMemorySummary || '',
      previous_last_action_summary: overlapReference.previousLastActionSummary || previousLastActionSummary || '',
    }
    : (previousLastActionSummary
      ? {
        previous_key_points: [],
        previous_pending_threads: [],
        previous_memory_summary: '',
        previous_last_action_summary: previousLastActionSummary,
      }
      : null);

  return {
    case: detectiveCase || null,
    investigation_state: sanitizeInvestigationState(investigationState),
    recent_turns: Array.isArray(detectiveHistory)
      ? detectiveHistory.slice(-2).map(normalizeDetectiveHistoryEntry)
      : [],
    metadata: {
      turn,
      maxTurns,
      forceEnding: Boolean(forceEnding),
      forceEndingRetry: Boolean(forceEndingRetry),
      scene_shift_required: Boolean(sceneShiftRequired),
      action_requires_immediate_resolution: true,
      force_action_retry: Boolean(forceActionRetry),
      previous_last_action_summary: overlapGuard?.previous_last_action_summary || previousLastActionSummary || '',
      player_gender: gender === 'female' ? 'female' : 'male',
    },
    overlap_guard: overlapGuard,
    current_state: {
      memory_summary: clipMemorySummary(currentMemorySummary) || '',
    },
    player_profile: {
      gender: gender === 'female' ? 'female' : 'male',
      pronoun: gender === 'female' ? '她' : '他',
      perspective: gender === 'female' ? '以女性第一人稱敘述辦案' : '以男性第一人稱敘述辦案',
    },
    player_action: sanitizeUserAction(userAction || {}),
  };
}

function sanitizeInvestigationState(state = {}) {
  const suspicionSource = state.suspicionScores || state.suspicion_scores || {};
  const suspicion = {};
  Object.entries(suspicionSource).forEach(([name, score]) => {
    if (Number.isFinite(score)) {
      suspicion[name] = Math.max(0, Math.min(100, Math.round(score)));
    }
  });

  return {
    clue_progress: Number.isFinite(state.clueProgress) ? state.clueProgress : null,
    suspicion_scores: suspicion,
    time_remaining: Number.isFinite(state.timeRemaining) ? Math.floor(state.timeRemaining) : null,
    contradictions: Array.isArray(state.contradictions) ? state.contradictions : [],
    found_evidence: Array.isArray(state.foundEvidence) ? state.foundEvidence : [],
  };
}

function normalizeDetectiveHistoryEntry(entry = {}) {
  return {
    turn: entry.turn,
    one_hard_fact: entry.one_hard_fact || entry.oneHardFact || '',
    evidence_chain_delta: entry.evidence_chain_delta || entry.evidenceChainDelta || '',
    working_theory: entry.working_theory || entry.workingTheory || '',
    knowledge_base: Array.isArray(entry.knowledge_base || entry.knowledgeBase)
      ? (entry.knowledge_base || entry.knowledgeBase)
      : [],
    json_state_update: entry.json_state_update || entry.jsonStateUpdate || null,
    player_action: sanitizeUserAction(entry.player_action || entry.playerAction || {}),
    memory_summary: entry.memory_summary || entry.memorySummary || '',
    last_action_summary: entry.last_action_summary || entry.lastActionSummary || '',
  };
}

function convertStateForAi(state = {}) {
  return {
    player_trust: Number.isFinite(state.playerTrust) ? state.playerTrust : null,
    clue_progress: Number.isFinite(state.clueProgress) ? state.clueProgress : null,
    danger_level: Number.isFinite(state.dangerLevel) ? state.dangerLevel : null,
  };
}

function extractJson(rawContent) {
  if (!rawContent) {
    throw new Error('OpenAI response is empty');
  }
  const trimmed = rawContent.trim();
  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch (error) {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Unable to locate JSON block in OpenAI response');
    }
    const snippet = trimmed.slice(start, end + 1);
    JSON.parse(snippet);
    return snippet;
  }
}

module.exports = {
  createOpenAIProvider,
};
