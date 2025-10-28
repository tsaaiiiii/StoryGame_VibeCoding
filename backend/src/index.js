const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");

const { aiConfig } = require("./config");
const { createOpenAIProvider } = require("./providers/openai");

const PORT = process.env.PORT || 5001;

const STORY_LENGTH_TURNS = {
  short: 5,
  medium: 8,
  long: 12,
};

const THEME_PROFILES = {
  wuxia: {
    name: "武俠冒險",
    worldview: "古代武林風雲再起，門派暗潮洶湧，信義與復仇交纏。",
    story_beats: ["起", "恩怨", "背叛", "抉擇", "收束"],
    style: "詩意、有風聲與劍影的古風節奏，善用風、月、雪、血、劍的比喻。",
    conflict: "信義與復仇的兩難；拯救或毀滅江湖。",
    ending_style: "蒼涼或釋懷，有俠骨重情。",
    must_include:
      "每段劇情加入具象動作、俠義台詞與主角的內心獨白，並為新角色賦予自然中文名字。",
  },
  detective: {
    name: "偵探推理",
    worldview: "現代都市陰影下，真相與謊言交錯。",
    story_beats: [
      "案件藍本",
      "查證事實累積",
      "推論修正",
      "反轉揭露",
      "破案結局",
    ],
    style:
      "參考《名偵探柯南》風格：節奏快、線索明確、邏輯推演緊湊，描繪霓虹、雨聲、指紋、錄音等感官細節。",
    conflict: "任何人都可懷疑，但真相不可被懷疑。",
    ending_style: "意料之外的反轉，帶一絲冷峻或悲傷。",
    must_include:
      "每段劇情新增一條查證事實，更新證據鏈與所有嫌疑人的懷疑度，並遵循辦案輸出規格，角色需以自然中文名字稱呼彼此。",
    requiresBlueprint: true,
  },
  apocalypse: {
    name: "末日生存",
    worldview: "病毒、戰火與飢荒摧毀世界，文明邊界崩塌。",
    story_beats: ["起", "探索", "背叛或抉擇", "絕境", "希望或毀滅"],
    style: "壓迫感強，充滿冷空氣、灰塵、金屬味等感官描寫。",
    conflict: "信任與生存的拉鋸；救誰、棄誰、相信誰。",
    ending_style: "苦澀現實，可能僅留微弱希望。",
    must_include:
      "每段劇情呈現具體環境壓力與角色心理掙扎，並為新角色賦予自然中文名字。",
  },
  school: {
    name: "青春校園",
    worldview: "現代校園裡友情與曖昧交織，每個瞬間都可能成為一生記憶。",
    story_beats: ["相遇", "曖昧", "誤會", "分離", "成長或重逢"],
    style: "參考乙女遊戲風格：柔光、內心獨白、浪漫緊張，善用細膩感官描寫。",
    conflict: "愛是理解而非佔有；遺憾讓青春真實。",
    ending_style: "可能是錯過後成長、短暫幸福或平靜重逢。",
    must_include:
      "每段劇情包含細膩動作、情緒台詞與內心旁白，讓角色以自然中文名字互動。",
  },
};

const INTRO_LIBRARY = {
  wuxia: {
    scene: [
      "夜雨洗過青石古道，竹影在暖燈下輕顫。",
      "你這名落魄俠客負手立於驛站亭外，舊傷隱隱作痛。",
      "隱世女醫替你束緊繃帶，醉劍老者與叛門少年分據兩側戒備。",
      "遠方梵鐘突斷，象徵神秘教派已嗅到你們的行蹤。",
    ],
    interaction: "女醫低聲叮囑：「別再逞強，江湖的命還等你決斷。」",
    progress: "過往恩怨重新點燃，你得先定義俠義再定勝負。",
    options: [
      "我遣叛門少年潛入古廟探查教派動向。",
      "我與醉劍老者布下竹葉陷阱，等待教徒踏入。",
      "我親自前往山門，打算以舊怨與首領對峙。",
    ],
    hint: "描述你的俠骨抉擇，或指揮同伴行動。",
  },
  detective: {
    scene: [
      "霓虹雨水交錯的港口巷弄充斥汽油味。",
      "你這名冷面偵探手握破舊錄音筆，警探搭檔在身旁擦拭手槍。",
      "記者夥伴遞上一張模糊的監視畫面，角落藏著不該出現的人影。",
      "遠處的貨櫃傳來低沉嗡鳴，像極了被封存的祕密。",
    ],
    interaction: "警探咬著牙說：「你懷疑誰我都信，但別再對真相退縮。」",
    progress: "謊言與線索只差一線，你得選擇追逐或設局。",
    options: [
      "我要求記者立刻聯絡線民確認錄音原始時間。",
      "我獨自前往貨櫃調查，讓警探在外圍設伏。",
      "我通知總局偵查隊支援，準備誘出幕後主使。",
    ],
    hint: "描寫你的推理或下達調度指令。",
  },
  apocalypse: {
    scene: [
      "廢棄醫院的鐵門嘎吱作響，冷空氣帶著金屬鏽味。",
      "你作為小隊隊長帶領工程師、醫護與神秘新成員穿過走廊。",
      "僅存的電力讓警示燈忽明忽暗，地板上的拖痕通往地下冷藏庫。",
      "遠處傳來被風吹動的鐵鍊聲，像誰在黑暗裡喘息。",
    ],
    interaction: "醫護握住你的手：「不論裡面有什麼，別讓我們失去人性。」",
    progress: "資源緊繃，信任更稀缺；必須決定誰先冒險。",
    options: [
      "我要派工程師檢查電力，確保撤離路線。",
      "我要親自前往冷藏庫確認拖痕盡頭。",
      "我要命新成員守在入口，測試他是否可靠。",
    ],
    hint: "敘述你的生存策略，或在道德上做出權衡。",
  },
  school: {
    scene: [
      "傍晚操場的夕陽映在積水上，你聽見社團練習的鼓點。",
      "身旁的青梅竹馬遞來便當盒，卻刻意避開你的視線。",
      "社團學長站在看台，像看穿你心底話；同班同學則揮手要你過去。",
      "校園廣播播放著溫柔的曲子，提醒今晚是社團成果發表。",
    ],
    interaction: "有人對你說：「你笑的時候，我就輸了。」那句話猶如暗號。",
    progress: "青春在呼喚決定，你無法同時抓住所有人。",
    options: [
      "我跟青梅竹馬坦白心聲，約她晚上再談。",
      "我答應社團學長幫忙，陪他一起準備演出。",
      "我對同班同學說出真實感受，任由爭吵揭開。",
    ],
    hint: "寫下你的細膩動作、台詞或內心旁白。",
  },
};

const STORY_PREMISES = {
  apocalypse: {
    short:
      "西元 2072 年，病毒肆虐全球。你是倖存者小隊的隊長，正帶領隊員潛入廢棄醫院尋找疫苗樣本。每一次選擇都會影響小隊的命運。",
    medium:
      "西元 2072 年，疫病與械鬥讓城市化作焦土。你率領流亡者穿梭在廢墟間，鎖定一座半毀的生技研究中心，據說封存著抗體藍圖。求生、背叛與希望交織在每一次決定裡。",
    long: "西元 2072 年，文明邊界崩解，病毒與軍閥夾擊人類。你統領的遊擊隊追尋傳說：國際醫療聯盟留下的終極解藥線索，就藏在被封鎖的地下醫療網絡。這趟跨越荒原的旅途，即將展開。",
  },
  detective: {
    short:
      "午夜的雨打在舊城區的霓虹上。你是調查局的特別搜查官，被派往一間廢棄製藥廠，追查失蹤記者留下的線索。黑暗裡隱約有人影跟隨。",
    medium:
      "連續的政治醜聞撼動整座城市。一名掌握關鍵證據的吹哨者向你求援，他約定在河港倉庫交付檔案。你必須查出誰真正操控這場陰謀。",
    long: "國際犯罪集團滲透首都，警方內部出現內鬼。你接手跨國調查，手握懸而未決的密檔，必須在高壓輿論與政治角力中揭穿真相，阻止更大的災難。",
  },
  wuxia: {
    short:
      "風雨迷漫的南山驛站中，你以年輕劍客之姿護送珍稀藥典。江湖傳聞有人要在此攔截，你必須在刀光劍影間保全秘笈。",
    medium:
      "七派盟約即將破裂。你奉師命前往衡州古城，調停一樁牽涉武林秘藏的紛爭。每個人都藏著鋒利的言語與暗器。",
    long: "朝廷秘令傳至門派：北境真龍密寶現世，武林勢力蠢蠢欲動。你肩負師門與百姓的命運，必須在江湖風暴掀起前掌握主導權。",
  },
  school: {
    short:
      "雨過天晴的校園裡，你是高三社團的幹部，正準備最後一場舞台演出。友情、夢想與未說的感情交織成日常的脈動。",
    medium:
      "升學壓力與夢想競賽同時壓在肩上。你帶領媒體研究社策劃校慶特展，需要在各方期待與人際衝突間找到平衡。",
    long: "畢業前夕的百日倒數開始，你成為學生會代行主席，要在有限時間裡重建校園信任、守護好友承諾，並為下一階段做出抉擇。",
  },
};

const INITIAL_STATE = {
  playerTrust: 60,
  clueProgress: 10,
  dangerLevel: 20,
};

function normalizeGender(value) {
  const normalized =
    typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "female" || normalized === "f" || normalized === "girl") {
    return "female";
  }
  return "male";
}

function getDefaultTone(theme) {
  const tones = {
    wuxia: "俠骨與風雨",
    detective: "懸疑與冷冽",
    apocalypse: "壓迫與求生",
    school: "溫柔與惆悵",
  };
  return tones[theme] || "未知氛圍";
}

function clampProgressValue(value, fallback) {
  if (Number.isFinite(value)) {
    return Math.max(0, Math.min(150, Math.round(value)));
  }
  if (Number.isFinite(fallback)) {
    return Math.max(0, Math.min(150, Math.round(fallback)));
  }
  return 0;
}

function estimateProgressIncrement(current) {
  if (!Number.isFinite(current)) {
    return 12;
  }
  if (current < 40) {
    return 12;
  }
  if (current < 70) {
    return 18;
  }
  if (current < 95) {
    return 15;
  }
  return 5;
}

function enforceProgressIncrement(previous, proposed) {
  const base = Number.isFinite(previous)
    ? Math.max(0, Math.min(100, previous))
    : 0;
  const target = Number.isFinite(proposed)
    ? Math.max(base, Math.min(100, proposed))
    : base;
  const minDelta = 5;
  const maxDelta = 25;

  const minAllowed = Math.min(100, base + minDelta);
  const maxAllowed = Math.min(100, base + maxDelta);

  if (target < minAllowed) {
    return minAllowed;
  }
  if (target > maxAllowed) {
    return maxAllowed;
  }
  return target;
}

function collectMemoryExtras(
  keyPoints = [],
  sceneLines = [],
  pendingThreads = [],
  lastActionSummary = ""
) {
  const extras = [];
  if (Array.isArray(keyPoints)) {
    extras.push(...keyPoints);
  }
  if (Array.isArray(sceneLines)) {
    extras.push(...sceneLines.slice(-2));
  }
  if (Array.isArray(pendingThreads)) {
    extras.push(...pendingThreads);
  }
  if (lastActionSummary) {
    extras.push(lastActionSummary);
  }
  return extras;
}

function normalizeActionText(text = "") {
  return String(text || "")
    .replace(/[\s　]+/g, "")
    .replace(/[，。、！？；,.!?…]/g, "")
    .toLowerCase();
}

function actionAppearsInScene(action = "", sceneLines = []) {
  const normalizedAction = normalizeActionText(action);
  if (!normalizedAction) {
    return false;
  }
  return sceneLines.some((line) =>
    normalizeActionText(line).includes(normalizedAction)
  );
}

function buildFallbackActionSummary(action = "", previousSummary = "") {
  let cleaned = String(action || "").trim();
  cleaned = cleaned.replace(/^我\s*(?:要|想|決定|準備)?/, "").trim();
  cleaned = cleaned
    .replace(/^I\s*(?:want to|will|decide to|plan to)?\s*/i, "")
    .trim();
  if (cleaned.startsWith("你")) {
    cleaned = cleaned.slice(1).trim();
  }
  if (!cleaned) {
    cleaned = "局勢立即出現變化";
  }
  let summary = `你的行動使${cleaned}。`;
  if (previousSummary && summary === previousSummary) {
    summary = `${summary.replace(/。$/, "")}，並推動新的局勢發展。`;
  }
  return summary;
}
function dedupeList(list = []) {
  if (!Array.isArray(list)) {
    return [];
  }
  return Array.from(
    new Set(
      list
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
    )
  );
}

function normalizeListItemText(text) {
  return typeof text === "string"
    ? text
        .replace(/[\s\u3000]+/g, " ")
        .replace(/[，。！？、,.!?；;]+$/u, "")
        .toLowerCase()
        .trim()
    : "";
}

function computeListOverlap(listA = [], listB = []) {
  const normalizedA = dedupeList(
    listA.map(normalizeListItemText).filter(Boolean)
  );
  const normalizedB = dedupeList(
    listB.map(normalizeListItemText).filter(Boolean)
  );
  if (!normalizedA.length || !normalizedB.length) {
    return 0;
  }
  const setB = new Set(normalizedB);
  const intersection = normalizedA.filter((item) => setB.has(item)).length;
  const denominator = Math.max(normalizedA.length, normalizedB.length);
  return denominator ? intersection / denominator : 0;
}

function splitTextTokensForSimilarity(text) {
  if (!text) {
    return [];
  }
  const lower = String(text).toLowerCase();
  const wordTokens = lower.match(/[a-z0-9]+/g) || [];
  const hanTokens = lower.match(/[\u4e00-\u9fff]/g) || [];
  const tokens = [...wordTokens, ...hanTokens];
  return dedupeList(tokens);
}

function computeTextSimilarity(a, b) {
  const tokensA = splitTextTokensForSimilarity(a);
  const tokensB = splitTextTokensForSimilarity(b);
  if (!tokensA.length || !tokensB.length) {
    return 0;
  }
  const setB = new Set(tokensB);
  const intersection = tokensA.filter((token) => setB.has(token)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return union ? intersection / union : 0;
}

function shouldTriggerSceneShiftSimilarity({
  nextKeyPoints = [],
  previousKeyPoints = [],
  nextPendingThreads = [],
  previousPendingThreads = [],
  nextSummary = "",
  previousSummary = "",
}) {
  const keyOverlap = computeListOverlap(nextKeyPoints, previousKeyPoints);
  const threadOverlap = computeListOverlap(
    nextPendingThreads,
    previousPendingThreads
  );
  const summaryOverlap = computeTextSimilarity(nextSummary, previousSummary);

  return keyOverlap > 0.6 || threadOverlap > 0.6 || summaryOverlap > 0.6;
}

function clipMemorySummary(text) {
  if (!text) {
    return "";
  }
  const trimmed = String(text).trim();
  if (trimmed.length <= 100) {
    return trimmed;
  }
  return `${trimmed.slice(0, 97)}…`;
}

function ensureDistinctSummary(current, previous, extras = []) {
  const base = (current || "").trim();
  const previousSummary = (previous || "").trim();
  let result = base;

  const extraCandidates = (Array.isArray(extras) ? extras : [])
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());

  if (!result && extraCandidates.length) {
    result = extraCandidates.slice(0, 2).join("；");
  }

  if (result && previousSummary && result === previousSummary) {
    const addition = extraCandidates.find((item) => !result.includes(item));
    if (addition) {
      result = `${result}；${addition}`;
    } else {
      result = `${result}；進度推進`;
    }
  }

  if (!result) {
    result = "故事持續推進。";
  }

  return clipMemorySummary(result);
}

function getFallbackOptions(theme) {
  const defaults = {
    wuxia: [
      "我沉住氣重新佈局，尋找破局之道。",
      "我與同伴分頭行動，摸清敵我虛實。",
      "我試著以對話試探對方底牌。",
    ],
    detective: [
      "我回顧現有證據，找出矛盾或漏洞。",
      "我鎖定一名嫌疑人展開深度訊問。",
      "我派人調閱更多監視與通聯資料。",
    ],
    apocalypse: [
      "我整理補給並規劃下一步撤離或進攻。",
      "我檢查隊伍士氣與人員狀態，安撫恐懼。",
      "我冒險向前偵察，確認真正的威脅來向。",
    ],
    school: [
      "我邀她換個地方聊聊，把心底話說清楚。",
      "我先處理即將到來的活動，再找時機表態。",
      "我尋求朋友協助，拉近彼此的距離。",
    ],
    default: [
      "我重新評估情勢，決定下一個確切行動。",
      "我嘗試與另一名角色合作，創造變化。",
      "我引入新的策略或視角，打破僵局。",
    ],
  };

  return defaults[theme] || defaults.default;
}

const app = express();
app.use(cors());
app.use(express.json());

const sessions = new Map();

const aiProvider = initializeAiProvider();

function initializeAiProvider() {
  if (!aiConfig || aiConfig.enabled === false) {
    return null;
  }

  const providerKey = (aiConfig.provider || "").toLowerCase();
  if (!providerKey) {
    return null;
  }

  const providerFactories = {
    openai: () => createOpenAIProvider(aiConfig.openai || {}),
  };

  const factory = providerFactories[providerKey];
  if (!factory) {
    console.warn(`AI provider "${providerKey}" is not supported.`);
    return null;
  }

  try {
    const provider = factory();
    if (!provider) {
      console.warn(`AI provider "${providerKey}" could not be initialized.`);
      return null;
    }
    return provider;
  } catch (error) {
    console.warn(`Failed to initialize AI provider "${providerKey}":`, error);
    return null;
  }
}

function createInitialState() {
  return { ...INITIAL_STATE };
}

function getPremise(theme, length) {
  return STORY_PREMISES?.[theme]?.[length] || STORY_PREMISES.wuxia.short;
}

function getThemeProfile(theme) {
  return THEME_PROFILES[theme] || null;
}

function sanitizeHistoryAction(action = {}) {
  if (!action || typeof action !== "object") {
    return { raw: "", resolved: "", id: null, type: "custom", intent: null };
  }
  return {
    raw: typeof action.raw === "string" ? action.raw : "",
    resolved: typeof action.resolved === "string" ? action.resolved : "",
    id: action.id ?? null,
    type: action.type || "custom",
    intent: action.intent || null,
  };
}

async function prepareDetectiveSession(session, options = {}) {
  const { awaitBlueprint = true } = options;

  if (session.theme !== "detective") {
    return;
  }

  if (
    !aiProvider ||
    typeof aiProvider.generateDetectiveBlueprint !== "function"
  ) {
    throw new Error("Detective blueprint generator unavailable");
  }

  session.meta = session.meta || {};
  session.meta.detective = session.meta.detective || {};

  if (session.meta.detective.case) {
    return;
  }

  if (session.meta.detective.blueprintPromise) {
    if (awaitBlueprint) {
      await session.meta.detective.blueprintPromise;
    }
    return;
  }

  const blueprintPayload = {
    theme: session.theme,
    length: session.length,
    premise: session.premise,
    maxTurns: session.maxTurns,
    theme_profile: getThemeProfile("detective"),
  };

  const promise = (async () => {
    try {
      const blueprintResponse = await aiProvider.generateDetectiveBlueprint(
        blueprintPayload
      );
      const caseData = blueprintResponse?.case || blueprintResponse;
      session.meta.detective.case = caseData;
      session.meta.detective.investigation = initializeDetectiveInvestigation(
        caseData,
        session.maxTurns
      );
      session.state = session.state || {};
      session.state.playerTrust = session.state.playerTrust ?? 50;
      session.state.dangerLevel = session.state.dangerLevel ?? 50;
      session.state.clueProgress = session.state.clueProgress ?? 0;
    } catch (error) {
      session.meta.detective.blueprintError = error;
      throw error;
    } finally {
      session.meta.detective.blueprintPromise = null;
    }
  })();

  session.meta.detective.blueprintPromise = promise;

  if (awaitBlueprint) {
    await promise;
  }
}

async function ensureDetectiveBlueprintReady(session) {
  await prepareDetectiveSession(session, { awaitBlueprint: true });
  if (session.meta?.detective?.blueprintError) {
    throw session.meta.detective.blueprintError;
  }
  if (!session.meta?.detective?.case) {
    throw new Error("Detective case blueprint is missing.");
  }
}

function initializeDetectiveInvestigation(caseData, maxTurns) {
  const suspects = Array.isArray(caseData?.suspects) ? caseData.suspects : [];
  const suspicionScores = {};
  suspects.forEach((suspect, index) => {
    const name = suspect?.name || `嫌疑人${index + 1}`;
    suspicionScores[name] = 50;
  });

  const initialEvidence = Array.isArray(caseData?.initial_evidence)
    ? caseData.initial_evidence.map(
        (item, idx) => item?.id || item?.detail || `E${idx + 1}`
      )
    : [];

  return {
    clueProgress: 0,
    suspicionScores,
    timeRemaining: maxTurns,
    contradictions: [],
    foundEvidence: initialEvidence,
  };
}

function clampStateValue(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeStateUpdate(currentState = {}, aiState = {}) {
  const before = {
    playerTrust: Number.isFinite(currentState.playerTrust)
      ? clampStateValue(currentState.playerTrust)
      : clampStateValue(INITIAL_STATE.playerTrust),
    clueProgress: Number.isFinite(currentState.clueProgress)
      ? clampStateValue(currentState.clueProgress)
      : clampStateValue(INITIAL_STATE.clueProgress),
    dangerLevel: Number.isFinite(currentState.dangerLevel)
      ? clampStateValue(currentState.dangerLevel)
      : clampStateValue(INITIAL_STATE.dangerLevel),
  };

  const next = { ...before };
  const delta = {
    playerTrust: 0,
    clueProgress: 0,
    dangerLevel: 0,
  };

  const mapping = [
    { aiKey: "player_trust", stateKey: "playerTrust" },
    { aiKey: "clue_progress", stateKey: "clueProgress" },
    { aiKey: "danger_level", stateKey: "dangerLevel" },
  ];

  mapping.forEach(({ aiKey, stateKey }) => {
    const source = aiState?.[aiKey] || {};
    const providedValue = clampStateValue(source.value);
    const providedDelta = Number.isFinite(source.delta)
      ? Math.round(source.delta)
      : 0;
    const tentative =
      providedValue ?? clampStateValue(before[stateKey] + providedDelta);
    const nextValue = tentative ?? before[stateKey];
    next[stateKey] = nextValue;
    delta[stateKey] = nextValue - before[stateKey];
  });

  return { state: next, delta };
}

function normalizeOptions(rawOptions) {
  if (!Array.isArray(rawOptions)) {
    return [];
  }

  const allowed = ["A", "B", "C"];
  const seen = new Set();
  const normalized = [];

  rawOptions.forEach((option) => {
    if (!option || typeof option !== "object") {
      return;
    }
    const id = String(option.id || "")
      .trim()
      .toUpperCase();
    const text = typeof option.text === "string" ? option.text.trim() : "";
    if (!allowed.includes(id) || !text || seen.has(id)) {
      return;
    }
    seen.add(id);
    normalized.push({ id, text });
  });

  normalized.sort((a, b) => allowed.indexOf(a.id) - allowed.indexOf(b.id));

  if (!normalized.length) {
    return [];
  }

  return normalized;
}

function ensureEndingScene(sceneLines) {
  const lines = Array.isArray(sceneLines) ? [...sceneLines] : [];
  if (lines.length >= 5) {
    return lines;
  }
  const fillers = [
    "你回望同行者的面龐，確定每個人都記住今晚的抉擇。",
    "避難所的無線電開始呼叫你們的代號，外界終於得知成果。",
    "微弱的晨光穿透廢墟屋頂，你意識到新的希望被重新點燃。",
    "你將剩餘的補給收好，準備迎接下一段旅程。",
  ];
  while (lines.length < 5 && fillers.length) {
    lines.push(fillers.shift());
  }
  return lines;
}

function buildNarrative({
  turn,
  progress,
  sceneLines,
  options,
  freeHint,
  status,
  includePremise,
  premise,
  endingSummary,
  keyPoints,
  pendingThreads,
  tone,
}) {
  const output = [];

  if (includePremise && typeof premise === "string" && premise.trim()) {
    output.push("[前情提要]");
    output.push(premise.trim());
    output.push("");
  }

  const progressLabel = Number.isFinite(progress)
    ? Math.max(0, Math.min(150, Math.round(progress)))
    : null;

  if (progressLabel !== null) {
    output.push(`╔════════ 進度 ${progressLabel}% ════════╗`);
  } else {
    output.push(`╔════════ SCENE ${turn} ════════╗`);
  }
  output.push("【劇情】");
  sceneLines.forEach((line) => {
    if (line) {
      output.push(line);
    }
  });

  if (Array.isArray(keyPoints) && keyPoints.length) {
    output.push("");
    output.push("【重點】");
    keyPoints.forEach((point) => output.push(`- ${point}`));
  }

  if (Array.isArray(pendingThreads) && pendingThreads.length) {
    output.push("");
    output.push("【未決線索】");
    pendingThreads.forEach((thread) => output.push(`- ${thread}`));
  }

  if (tone) {
    output.push("");
    output.push(`【氛圍】${tone}`);
  }

  if (status === "ended") {
    if (endingSummary) {
      output.push("");
      output.push(`【結局】${endingSummary}`);
    }
  } else {
    if (options.length) {
      output.push("");
      output.push("【選項】");
      options.forEach((option) => {
        output.push(`${option.id}. ${option.text}`);
      });
    }

    if (freeHint) {
      output.push("");
      output.push(`💡 ${freeHint}`);
    }

    output.push("💬 請輸入選項代號或自由輸入一句話：");
  }

  return output.join("\n");
}

function createIntroSegment({
  theme,
  turn,
  state,
  premise,
  maxTurns,
  detectiveCase,
}) {
  const introTemplate = INTRO_LIBRARY[theme] || INTRO_LIBRARY.wuxia;
  let sceneLines = introTemplate.scene || [];
  let optionsRaw = introTemplate.options || [];
  let hint = introTemplate.hint || "描述你的行動或下達指令。";
  let interactionLine = introTemplate.interaction || "";
  let progressLine = introTemplate.progress || "";
  const tone = getDefaultTone(theme);

  const pendingByTheme = {
    wuxia: ["舊怨尚未解決", "俠義抉擇仍待定奪"],
    detective: detectiveCase
      ? ["釐清所有嫌疑人的動機", "建立完整證據鏈"]
      : ["等待案件藍本建構完成"],
    apocalypse: ["資源補給仍告急", "隊伍安全尚未確認"],
    school: ["未說出口的情感", "尚未解開的誤會"],
  };
  let pendingThreads = pendingByTheme[theme] ? [...pendingByTheme[theme]] : [];

  if (theme === "detective") {
    if (detectiveCase) {
      const victim = detectiveCase.victim || {};
      const suspects = Array.isArray(detectiveCase.suspects)
        ? detectiveCase.suspects.map((s) => s.name).filter(Boolean)
        : [];
      const suspectLine = suspects.length
        ? `嫌疑人：${suspects.join("、")}`
        : "嫌疑人名單待確認。";
      sceneLines = [
        "港口被雨霧籠罩，警戒線在霓虹燈下閃爍。",
        `受害者 ${victim.name || "不詳"}（${
          victim.occupation || "職業未明"
        }）被發現死於 ${victim.cause_of_death || "可疑手段"}。`,
        `推定死亡時間：${victim.time_of_death || "尚未確認"}，案發地點：${
          detectiveCase.crime_scene || detectiveCase.setting || "偏僻倉庫"
        }。`,
        suspectLine,
      ];
      interactionLine =
        "警探搭檔壓低聲音：「我們得按查證事實辦案，先鎖定可以驗證的證據。」";
      progressLine = "案件藍本已建立，需要一步步驗證證據鏈、排除偽線索。";
      optionsRaw = [
        "我先勘驗屍體與現場痕跡，確認死亡機制。",
        "我要調閱周邊監視器與通聯紀錄，建立時間線。",
        "我優先訊問關鍵嫌疑人，測試他們的不在場證明。",
      ];
      hint =
        "選擇先「勘驗現場」「比對證據」或「訊問嫌疑人」，帶來可驗證的查證事實。";
    } else {
      sceneLines = [
        "港口雨霧覆蓋整片碼頭，你與警探先封鎖案發區域。",
        "鑑識人員正在同步受害者與嫌疑人資料，案件藍本即將完成。",
      ];
      interactionLine =
        "警探提醒：「先巡一圈掌握現場，案件資料整理好就立刻開始查證。」";
      progressLine =
        "系統正在建構案件藍本，稍後將提供受害者、嫌疑人與初始物證。";
      optionsRaw = [
        "我先記錄現場環境與可見痕跡，等待資料同步。",
        "我與記者整理既有通報內容，預備交叉驗證。",
        "我建立臨時時間線草稿，預留檢視空間。",
      ];
      hint = "先巡視現場或整理情報，案件資料同步後再進行查證。";
    }
  }

  const optionObjects = optionsRaw.slice(0, 3).map((text, index) => ({
    id: ["A", "B", "C"][index],
    text,
  }));

  const introProgress = theme === "detective" ? (detectiveCase ? 12 : 4) : 10;
  const keyPoints = sceneLines.slice(0, 2).filter(Boolean);

  const introPlayerAction =
    theme === "detective"
      ? detectiveCase
        ? "同步案件資料"
        : "調查準備"
      : "故事開始";
  pendingThreads = dedupeList(pendingThreads);
  const memorySummary = clipMemorySummary(
    keyPoints.length
      ? keyPoints.join("；")
      : sceneLines.filter(Boolean).slice(0, 2).join("；")
  );

  const narrative = buildNarrative({
    turn,
    progress: introProgress,
    sceneLines,
    options: optionObjects,
    freeHint: hint,
    status: "ongoing",
    includePremise: true,
    premise,
    endingSummary: "",
    keyPoints,
    pendingThreads,
    tone,
  });

  const display = {
    sceneTitle: `Progress ${introProgress}%`,
    background: sceneLines,
    recap: premise ? `【前情提要】${premise}` : "",
    interaction: interactionLine,
    progress: progressLine,
  };

  return {
    narrative,
    options: optionObjects.map((option) => `${option.id}. ${option.text}`),
    display,
    nextTurn: turn + 1,
    state,
    progress: introProgress,
    keyPoints,
    pendingThreads,
    tone,
    stateDelta: {
      playerTrust: 0,
      clueProgress: 0,
      dangerLevel: 0,
    },
    status: "ongoing",
    endingTrigger: null,
    playerAction: introPlayerAction,
    memorySummary,
    lastActionSummary: "",
    ai: {
      scene: sceneLines,
      options: optionObjects,
      freeHint: hint,
      status: "ongoing",
      endingTrigger: null,
      endingSummary: "",
      turnSummary: "",
      source: "intro-template",
      progress: introProgress,
      keyPoints,
      pendingThreads,
      tone,
      memorySummary,
      lastActionSummary: "",
    },
  };
}

function buildHistory(log = []) {
  return log.map((entry, index) => ({
    sequence: index + 1,
    status: entry.status,
    ending_trigger: entry.endingTrigger || null,
    scene: Array.isArray(entry.ai?.scene) ? entry.ai.scene.slice(0, 2) : [],
    state_after: entry.state,
    progress: entry.ai?.progress ?? entry.progress ?? null,
    key_points: entry.ai?.keyPoints || [],
    pending_threads: entry.ai?.pendingThreads || [],
    tone: entry.ai?.tone || "",
    player_action: sanitizeHistoryAction({
      raw: entry.actionRaw,
      resolved: entry.playerAction || entry.actionResolved,
      id: entry.actionId,
      type: entry.actionType,
      intent: entry.actionIntent || null,
    }),
    turn_summary: entry.ai?.turnSummary || entry.turnSummary || "",
    memory_summary: entry.memorySummary || entry.ai?.memorySummary || "",
    last_action_summary:
      entry.ai?.lastActionSummary || entry.lastActionSummary || "",
  }));
}

function buildDetectiveHistory(log = []) {
  return log
    .filter((entry) => entry.ai && entry.ai.kind === "detective")
    .map((entry) => ({
      turn: entry.turn,
      one_hard_fact: entry.ai.oneHardFact || "",
      evidence_chain_delta: entry.ai.evidenceChainDelta || "",
      working_theory: entry.ai.workingTheory || "",
      knowledge_base: entry.ai.knowledgeBase || [],
      json_state_update: entry.ai.jsonStateUpdate || null,
      player_action: sanitizeHistoryAction({
        raw: entry.actionRaw,
        resolved: entry.actionResolved,
        intent: entry.actionIntent || null,
      }),
      memory_summary: entry.memorySummary || entry.ai?.memorySummary || "",
      last_action_summary:
        entry.ai.lastActionSummary || entry.lastActionSummary || "",
    }));
}

function normalizeUserAction(session, rawInput) {
  const trimmed = typeof rawInput === "string" ? rawInput.trim() : "";
  if (!trimmed) {
    return {
      raw: "",
      resolved: "",
      id: null,
      type: "empty",
      intent: "none",
    };
  }

  const lastEntry = session.log[session.log.length - 1];
  const candidate = trimmed.toUpperCase();
  if (lastEntry && /^[ABC]$/.test(candidate)) {
    const optionMeta = lastEntry.ai?.options?.find(
      (opt) => opt.id === candidate
    );
    const optionText =
      optionMeta?.text ||
      (lastEntry.options || [])
        .find((option) => option.startsWith(`${candidate}.`))
        ?.replace(/^\w\.\s*/, "") ||
      trimmed;
    return {
      raw: trimmed,
      resolved: optionText,
      id: candidate,
      type: "option",
      intent: inferActionIntent(optionText),
    };
  }

  return {
    raw: trimmed,
    resolved: trimmed,
    id: null,
    type: "custom",
    intent: inferActionIntent(trimmed),
  };
}

function inferActionIntent(text) {
  if (!text) {
    return "follow_up";
  }
  const normalized = text.replace(/\s+/g, "").toLowerCase();
  const keywords = text;

  const interrogatePatterns = [
    /問/,
    /詢/,
    /談/,
    /對質/,
    /詢問/,
    /對話/,
    /interview/i,
    /question/i,
  ];
  const examinePatterns = [
    /檢/,
    /勘/,
    /察/,
    /查看/,
    /搜尋/,
    /現場/,
    /監視/,
    /探查/,
    /search/i,
    /inspect/i,
    /scan/i,
  ];
  const analyzePatterns = [
    /分析/,
    /比對/,
    /推理/,
    /研判/,
    /整理/,
    /重建/,
    /重構/,
    /鑑定/,
    /analy/i,
    /compute/i,
  ];
  const followPatterns = [/追/, /跟進/, /follow/i, /追查/];

  if (interrogatePatterns.some((pattern) => pattern.test(text))) {
    return "interrogate";
  }
  if (examinePatterns.some((pattern) => pattern.test(text))) {
    return "examine";
  }
  if (analyzePatterns.some((pattern) => pattern.test(text))) {
    return "analyze";
  }
  if (followPatterns.some((pattern) => pattern.test(text))) {
    return "follow_up";
  }

  if (normalized.includes("interrogat")) {
    return "interrogate";
  }
  if (normalized.includes("examin") || normalized.includes("inspect")) {
    return "examine";
  }
  if (normalized.includes("analy") || normalized.includes("deduce")) {
    return "analyze";
  }

  return "follow_up";
}

async function requestAiSegment(params, { forceEnding, retry }) {
  return aiProvider.generate({
    ...params,
    forceEnding,
    forceEndingRetry: retry,
  });
}

async function generateStorySegment({
  theme,
  length,
  turn,
  previousStory = [],
  maxTurns,
  state,
  premise,
  userAction,
  includePremise = false,
  progress = 0,
  keyPoints = [],
  pendingThreads = [],
  tone = getDefaultTone(theme),
  gender = "male",
}) {
  const normalizedGender = normalizeGender(gender);
  if (theme === "detective") {
    throw new Error("generateStorySegment is not used for detective theme");
  }

  if (!aiProvider) {
    throw new Error("AI provider is not configured.");
  }

  const effectivePremise = premise || getPremise(theme, length);
  const effectiveState = state || createInitialState();
  const effectiveMaxTurns = maxTurns || STORY_LENGTH_TURNS[length] || 100;
  const previousProgress = Number.isFinite(progress)
    ? progress
    : Math.min(95, Math.round((turn / Math.max(effectiveMaxTurns, 1)) * 100));
  const forceEnding =
    previousProgress >= 100 && (!pendingThreads || !pendingThreads.length);
  const themeProfile = getThemeProfile(theme);

  const history = buildHistory(previousStory);

  const previousEntry = previousStory.length
    ? previousStory[previousStory.length - 1]
    : null;
  const previousKeyPoints = previousEntry
    ? dedupeList([
        ...(Array.isArray(previousEntry.keyPoints)
          ? previousEntry.keyPoints
          : []),
        ...(Array.isArray(previousEntry.ai?.keyPoints)
          ? previousEntry.ai.keyPoints
          : []),
      ])
    : [];
  const previousPendingThreads = previousEntry
    ? dedupeList([
        ...(Array.isArray(previousEntry.pendingThreads)
          ? previousEntry.pendingThreads
          : []),
        ...(Array.isArray(previousEntry.ai?.pendingThreads)
          ? previousEntry.ai.pendingThreads
          : []),
      ])
    : [];
  const previousMemorySummary =
    previousEntry?.memorySummary ||
    previousEntry?.ai?.memorySummary ||
    previousEntry?.memory_summary ||
    "";

  const previousLastActionSummary =
    previousEntry?.lastActionSummary ||
    previousEntry?.ai?.lastActionSummary ||
    "";

  const overlapReference = {
    previousKeyPoints,
    previousPendingThreads,
    previousMemorySummary,
    previousLastActionSummary,
  };

  async function produceSegment({ sceneShiftRequired, forceActionRetry }) {
    const payload = {
      theme,
      length,
      turn,
      maxTurns: effectiveMaxTurns,
      progress: previousProgress,
      keyPoints,
      pendingThreads,
      tone,
      premise: effectivePremise,
      state: effectiveState,
      history,
      userAction,
      includePremise,
      themeProfile,
      sceneShiftRequired: Boolean(sceneShiftRequired),
      overlapReference: sceneShiftRequired ? overlapReference : null,
      forceActionRetry: Boolean(forceActionRetry),
      memorySummary: previousMemorySummary,
      previousLastActionSummary,
      gender: normalizedGender,
    };

    let aiResult = await requestAiSegment(payload, {
      forceEnding,
      retry: false,
    });

    if (forceEnding && aiResult?.status !== "ended") {
      aiResult = await requestAiSegment(payload, { forceEnding, retry: true });
    }

    const usageInfo = aiResult && aiResult.__usage ? aiResult.__usage : null;
    if (aiResult && aiResult.__usage) {
      delete aiResult.__usage;
    }

    const sceneLinesRaw = Array.isArray(aiResult?.scene)
      ? aiResult.scene
          .map((line) => (typeof line === "string" ? line.trim() : ""))
          .filter(Boolean)
      : [];

    if (!sceneLinesRaw.length) {
      throw new Error("AI result did not provide valid scene lines.");
    }

    let nextProgress = clampProgressValue(
      aiResult.progress,
      clampProgressValue(
        aiResult?.state?.clue_progress?.value,
        previousProgress + estimateProgressIncrement(previousProgress)
      )
    );
    nextProgress = enforceProgressIncrement(previousProgress, nextProgress);
    let resultKeyPoints = Array.isArray(aiResult.key_points)
      ? aiResult.key_points.filter(Boolean)
      : keyPoints;
    let resultPendingThreads = Array.isArray(aiResult.pending_threads)
      ? aiResult.pending_threads.filter(Boolean)
      : pendingThreads;
    const resultTone =
      typeof aiResult.tone === "string" && aiResult.tone.trim()
        ? aiResult.tone.trim()
        : tone;

    let status =
      aiResult.status === "ended" || forceEnding ? "ended" : "ongoing";
    if (
      status !== "ended" &&
      nextProgress >= 100 &&
      (!resultPendingThreads || !resultPendingThreads.length)
    ) {
      status = "ended";
    }

    const endingEligible = nextProgress >= 90;
    if (status === "ended" && !endingEligible) {
      status = "ongoing";
    }

    if (status === "ended") {
      resultPendingThreads = [];
    }

    resultPendingThreads = dedupeList(resultPendingThreads);
    resultKeyPoints = Array.isArray(resultKeyPoints)
      ? dedupeList(resultKeyPoints)
      : [];

    let options = status === "ended" ? [] : normalizeOptions(aiResult.options);
    if (status !== "ended") {
      const allowed = ["A", "B", "C"];
      const fallbackTexts = getFallbackOptions(theme);
      const used = new Set(options.map((option) => option.id));
      allowed.forEach((id, index) => {
        if (!used.has(id)) {
          const text =
            fallbackTexts[index] ||
            fallbackTexts[fallbackTexts.length - 1] ||
            "我繼續推進故事。";
          options.push({ id, text });
          used.add(id);
        }
      });
      options.sort((a, b) => allowed.indexOf(a.id) - allowed.indexOf(b.id));
    }
    const freeHint =
      status === "ended"
        ? ""
        : typeof aiResult.free_hint === "string"
        ? aiResult.free_hint.trim()
        : "請以第一人稱描述你的行動。";

    const { state: nextState, delta: stateDelta } = computeStateUpdate(
      effectiveState,
      aiResult.state
    );

    let sceneLines =
      status === "ended"
        ? ensureEndingScene(sceneLinesRaw)
        : [...sceneLinesRaw];

    let endingSummary = status === "ended" ? aiResult.ending_summary || "" : "";
    if (status === "ended" && !endingSummary) {
      endingSummary =
        "你收束整場行動並帶著關鍵成果離開，隊伍準備迎接下一個黎明。";
    }

    const effectivePlayerAction =
      userAction &&
      typeof userAction.resolved === "string" &&
      userAction.resolved.trim()
        ? userAction.resolved.trim()
        : userAction &&
          typeof userAction.raw === "string" &&
          userAction.raw.trim()
        ? userAction.raw.trim()
        : "";
    const actionAppears = actionAppearsInScene(
      effectivePlayerAction,
      sceneLines
    );

    let memorySummaryRaw =
      typeof aiResult.memory_summary === "string" &&
      aiResult.memory_summary.trim()
        ? aiResult.memory_summary.trim()
        : Array.isArray(resultKeyPoints) && resultKeyPoints.length
        ? resultKeyPoints.join("；")
        : sceneLines.slice(0, 2).join("；");

    let memorySummary = ensureDistinctSummary(
      memorySummaryRaw,
      previousMemorySummary,
      collectMemoryExtras(resultKeyPoints, sceneLines, resultPendingThreads, "")
    );

    const overlapTooHigh = shouldTriggerSceneShiftSimilarity({
      nextKeyPoints: resultKeyPoints,
      previousKeyPoints,
      nextPendingThreads: resultPendingThreads,
      previousPendingThreads,
      nextSummary: memorySummary,
      previousSummary: previousMemorySummary,
    });

    if (overlapTooHigh && !sceneShiftRequired) {
      return produceSegment({
        sceneShiftRequired: true,
        forceActionRetry: Boolean(forceActionRetry),
      });
    }

    if (overlapTooHigh && sceneShiftRequired) {
      const forcedKeyPoint = "突如其來的變數打破原本節奏";
      const forcedPending = "新的場景變因尚待釐清";
      if (!resultKeyPoints.includes(forcedKeyPoint)) {
        resultKeyPoints.push(forcedKeyPoint);
      }
      if (!resultPendingThreads.includes(forcedPending)) {
        resultPendingThreads.push(forcedPending);
      }
      resultKeyPoints = dedupeList(resultKeyPoints);
      resultPendingThreads = dedupeList(resultPendingThreads);
      const fallbackSceneLine =
        "突如其來的變化迫使眾人移動腳步，場景氣息隨之翻轉。";
      if (!sceneLines.includes(fallbackSceneLine)) {
        sceneLines.push(fallbackSceneLine);
      }
      const adjustedExtras = collectMemoryExtras(
        resultKeyPoints,
        sceneLines,
        resultPendingThreads,
        ""
      );
      memorySummary = ensureDistinctSummary(
        `${memorySummary}；突如其來的變化迫使改變`,
        previousMemorySummary,
        adjustedExtras
      );
    }

    const actionAcknowledgedRaw =
      typeof aiResult.last_action_summary === "string"
        ? aiResult.last_action_summary.trim()
        : "";
    let lastActionSummary = actionAcknowledgedRaw;
    const actionProvided = Boolean(effectivePlayerAction);

    if (actionProvided && !lastActionSummary) {
      if (!actionAppears && !forceActionRetry) {
        return produceSegment({
          sceneShiftRequired: Boolean(sceneShiftRequired),
          forceActionRetry: true,
        });
      }
      lastActionSummary = buildFallbackActionSummary(
        effectivePlayerAction,
        previousLastActionSummary
      );
      if (!actionAppears) {
        const reinforceLine = "你的迅速決斷立即翻動氣氛，眾人被迫緊急應對。";
        if (
          !sceneLines.some((line) =>
            normalizeActionText(line).includes(
              normalizeActionText(reinforceLine)
            )
          )
        ) {
          sceneLines.push(reinforceLine);
        }
      }
    }

    if (
      lastActionSummary &&
      previousLastActionSummary &&
      lastActionSummary === previousLastActionSummary
    ) {
      lastActionSummary = `${lastActionSummary.replace(
        /。$/,
        ""
      )}，同時推動新的局勢發展。`;
    }

    memorySummary = ensureDistinctSummary(
      memorySummary,
      previousMemorySummary,
      collectMemoryExtras(
        resultKeyPoints,
        sceneLines,
        resultPendingThreads,
        lastActionSummary
      )
    );

    const narrative = buildNarrative({
      turn,
      progress: nextProgress,
      sceneLines,
      options,
      freeHint,
      status,
      includePremise,
      premise: includePremise ? effectivePremise : "",
      endingSummary,
      keyPoints: resultKeyPoints,
      pendingThreads: resultPendingThreads,
      tone: resultTone,
    });

    const optionsForDisplay = options.map(
      (option) => `${option.id}. ${option.text}`
    );

    const aiMeta = {
      scene: sceneLines,
      options,
      freeHint,
      status,
      endingTrigger: aiResult.ending_trigger || null,
      endingSummary,
      turnSummary: aiResult.turn_summary || "",
      progress: nextProgress,
      keyPoints: resultKeyPoints,
      pendingThreads: resultPendingThreads,
      tone: resultTone,
      usage: usageInfo,
      memorySummary,
      sceneShiftRequired: Boolean(sceneShiftRequired),
      lastActionSummary,
    };

    return {
      narrative,
      options: optionsForDisplay,
      display: null,
      nextTurn: turn + 1,
      state: nextState,
      stateDelta,
      status,
      endingTrigger: aiResult.ending_trigger || null,
      playerAction: effectivePlayerAction,
      progress: nextProgress,
      keyPoints: resultKeyPoints,
      pendingThreads: resultPendingThreads,
      tone: resultTone,
      ai: aiMeta,
      memorySummary,
      lastActionSummary,
    };
  }

  return produceSegment({ sceneShiftRequired: false, forceActionRetry: false });
}

async function generateDetectiveStorySegment({ session, userAction }) {
  if (!aiProvider) {
    throw new Error("AI provider is not configured.");
  }

  await prepareDetectiveSession(session);

  const detectiveMeta = session.meta?.detective;
  if (!detectiveMeta?.case) {
    throw new Error("Detective case blueprint is missing.");
  }

  const turn = session.turn;
  const forceEnding = turn >= session.maxTurns;
  const normalizedGender = normalizeGender(session.gender);

  const investigation = detectiveMeta.investigation;
  investigation.timeRemaining = Math.max(
    session.maxTurns - session.log.length,
    0
  );

  const detectiveHistory = buildDetectiveHistory(session.log);

  const previousEntry = session.log.length
    ? session.log[session.log.length - 1]
    : null;
  const previousKeyPoints = previousEntry
    ? dedupeList([
        ...(Array.isArray(previousEntry.keyPoints)
          ? previousEntry.keyPoints
          : []),
        ...(Array.isArray(previousEntry.ai?.keyPoints)
          ? previousEntry.ai.keyPoints
          : []),
      ])
    : [];
  const previousPendingThreads = previousEntry
    ? dedupeList([
        ...(Array.isArray(previousEntry.pendingThreads)
          ? previousEntry.pendingThreads
          : []),
        ...(Array.isArray(previousEntry.ai?.pendingThreads)
          ? previousEntry.ai.pendingThreads
          : []),
      ])
    : [];
  const previousMemorySummary =
    previousEntry?.memorySummary ||
    previousEntry?.ai?.memorySummary ||
    previousEntry?.memory_summary ||
    "";

  const overlapReference = {
    previousKeyPoints,
    previousPendingThreads,
    previousMemorySummary,
  };

  async function produceSegment({ sceneShiftRequired, forceActionRetry }) {
    const payload = {
      theme: "detective",
      turn,
      maxTurns: session.maxTurns,
      detectiveCase: detectiveMeta.case,
      investigationState: investigation,
      detectiveHistory,
      userAction,
      forceEnding,
      sceneShiftRequired: Boolean(sceneShiftRequired),
      overlapReference: sceneShiftRequired ? overlapReference : null,
      forceActionRetry: Boolean(forceActionRetry),
      memorySummary: previousMemorySummary,
      previousLastActionSummary,
      gender: normalizedGender,
    };

    let aiResult = await aiProvider.generate(payload);

    if (forceEnding && aiResult?.status !== "ended") {
      aiResult = await aiProvider.generate({
        ...payload,
        forceEndingRetry: true,
      });
    }

    if (!aiResult || typeof aiResult !== "object") {
      throw new Error("Detective AI result is empty");
    }

    const usageInfo = aiResult.__usage || null;
    if (aiResult.__usage) {
      delete aiResult.__usage;
    }

    let sceneLines = Array.isArray(aiResult.scene_lines)
      ? aiResult.scene_lines
          .map((line) => (typeof line === "string" ? line.trim() : ""))
          .filter(Boolean)
      : [];
    const actionAppears = actionAppearsInScene(
      effectivePlayerAction,
      sceneLines
    );

    const optionsRaw = Array.isArray(aiResult.next_actions)
      ? aiResult.next_actions
      : [];

    let normalizedOptions = optionsRaw
      .filter((item) => item && item.id && item.text)
      .slice(0, 3)
      .map((item) => ({
        id: String(item.id).trim().toUpperCase(),
        text: String(item.text).trim(),
        intent: item.intent || null,
      }));

    if (aiResult.status !== "ended") {
      const allowed = ["A", "B", "C"];
      const fallbackTexts = getFallbackOptions("detective");
      const used = new Set(normalizedOptions.map((option) => option.id));
      allowed.forEach((id, index) => {
        if (!used.has(id)) {
          const text =
            fallbackTexts[index] ||
            fallbackTexts[fallbackTexts.length - 1] ||
            "我重新檢視證據，尋找突破口。";
          normalizedOptions.push({ id, text, intent: null });
          used.add(id);
        }
      });
      normalizedOptions.sort(
        (a, b) => allowed.indexOf(a.id) - allowed.indexOf(b.id)
      );
    } else {
      normalizedOptions = [];
    }

    const choicePrompt =
      typeof aiResult.choice_prompt === "string"
        ? aiResult.choice_prompt.trim()
        : "請選擇下一步的辦案行動。";

    const stateUpdateResult = applyDetectiveStateUpdate({
      investigation,
      update: aiResult.json_state_update,
      session,
    });

    let resultPendingThreads = Array.isArray(aiResult.pending_threads)
      ? aiResult.pending_threads.filter(Boolean)
      : session.pendingThreads || [];
    let resultKeyPoints = Array.isArray(aiResult.knowledge_base)
      ? aiResult.knowledge_base.filter(Boolean)
      : session.keyPoints || [];
    const resultTone =
      typeof aiResult.tone === "string" && aiResult.tone.trim()
        ? aiResult.tone.trim()
        : session.tone || getDefaultTone("detective");

    const baseProgress = clampProgressValue(
      aiResult?.json_state_update?.clue_progress?.value,
      stateUpdateResult.progress,
      investigation.clueProgress
    );
    let detectiveProgress = clampProgressValue(
      aiResult.progress,
      baseProgress,
      clampProgressValue(session.progress, baseProgress) +
        estimateProgressIncrement(session.progress || 30)
    );
    detectiveProgress = enforceProgressIncrement(
      session.progress || 0,
      detectiveProgress
    );

    const effectivePlayerAction =
      userAction &&
      typeof userAction.resolved === "string" &&
      userAction.resolved.trim()
        ? userAction.resolved.trim()
        : userAction &&
          typeof userAction.raw === "string" &&
          userAction.raw.trim()
        ? userAction.raw.trim()
        : "";

    let status = aiResult.status === "ended" ? "ended" : "ongoing";
    const forcedConclusion =
      forceEnding &&
      (!aiResult.ending_payload || !aiResult.ending_payload.culprit);
    let endingPayload = aiResult.ending_payload || null;
    if (
      status !== "ended" &&
      detectiveProgress >= 100 &&
      (!resultPendingThreads || !resultPendingThreads.length)
    ) {
      status = "ended";
    }
    if (status === "ended" && forcedConclusion) {
      endingPayload = buildFallbackDetectiveEnding({
        caseData: detectiveMeta.case,
        investigation,
      });
    }
    if (status === "ended") {
      resultPendingThreads = [];
    }

    resultPendingThreads = dedupeList(resultPendingThreads);
    resultKeyPoints = dedupeList(resultKeyPoints);

    const optionsForDisplay =
      status === "ended"
        ? []
        : normalizedOptions.map((option) => `${option.id}. ${option.text}`);

    let memorySummaryRaw =
      typeof aiResult.memory_summary === "string" &&
      aiResult.memory_summary.trim()
        ? aiResult.memory_summary.trim()
        : resultKeyPoints.length
        ? resultKeyPoints.join("；")
        : sceneLines.slice(0, 2).join("；");

    let memorySummary = ensureDistinctSummary(
      memorySummaryRaw,
      previousMemorySummary,
      collectMemoryExtras(resultKeyPoints, sceneLines, resultPendingThreads, "")
    );

    const overlapTooHigh = shouldTriggerSceneShiftSimilarity({
      nextKeyPoints: resultKeyPoints,
      previousKeyPoints,
      nextPendingThreads: resultPendingThreads,
      previousPendingThreads,
      nextSummary: memorySummary,
      previousSummary: previousMemorySummary,
    });

    if (overlapTooHigh && !sceneShiftRequired) {
      return produceSegment({
        sceneShiftRequired: true,
        forceActionRetry: Boolean(forceActionRetry),
      });
    }

    if (overlapTooHigh && sceneShiftRequired) {
      const forcedKeyPoint = "突如其來的線索逆轉現場節奏";
      const forcedPending = "新的疑點迫使調查換場進行";
      if (!resultKeyPoints.includes(forcedKeyPoint)) {
        resultKeyPoints.push(forcedKeyPoint);
      }
      if (!resultPendingThreads.includes(forcedPending)) {
        resultPendingThreads.push(forcedPending);
      }
      resultKeyPoints = dedupeList(resultKeyPoints);
      resultPendingThreads = dedupeList(resultPendingThreads);
      const fallbackLine =
        "一陣突如其來的警報聲響起，眾人被迫轉移至新的調查地點。";
      if (!sceneLines.includes(fallbackLine)) {
        sceneLines.push(fallbackLine);
      }
      const adjustedExtras = collectMemoryExtras(
        resultKeyPoints,
        sceneLines,
        resultPendingThreads,
        ""
      );
      memorySummary = ensureDistinctSummary(
        `${memorySummary}；新的警報迫使換場應對`,
        previousMemorySummary,
        adjustedExtras
      );
    }

    const lastActionSummaryRaw =
      typeof aiResult.last_action_summary === "string"
        ? aiResult.last_action_summary.trim()
        : "";
    let lastActionSummary = lastActionSummaryRaw;

    if (effectivePlayerAction && !lastActionSummary) {
      if (!actionAppears && !forceActionRetry) {
        return produceSegment({
          sceneShiftRequired: Boolean(sceneShiftRequired),
          forceActionRetry: true,
        });
      }
      lastActionSummary = buildFallbackActionSummary(
        effectivePlayerAction,
        previousLastActionSummary
      );
      if (!actionAppears) {
        const reinforceLine =
          "你的辦案指令立刻逆轉調查節奏，引起全員緊急調度。";
        if (
          !sceneLines.some((line) =>
            normalizeActionText(line).includes(
              normalizeActionText(reinforceLine)
            )
          )
        ) {
          sceneLines.push(reinforceLine);
        }
      }
    }

    if (
      lastActionSummary &&
      previousLastActionSummary &&
      lastActionSummary === previousLastActionSummary
    ) {
      lastActionSummary = `${lastActionSummary.replace(
        /。$/,
        ""
      )}，並引出新的辦案線索。`;
    }

    memorySummary = ensureDistinctSummary(
      memorySummary,
      previousMemorySummary,
      collectMemoryExtras(
        resultKeyPoints,
        sceneLines,
        resultPendingThreads,
        lastActionSummary
      )
    );

    const narrativeBundle = composeDetectiveNarrative({
      turn,
      progress: detectiveProgress,
      sceneLines,
      hardFact: aiResult.one_hard_fact || "",
      evidenceDelta: aiResult.evidence_chain_delta || "",
      workingTheory: aiResult.working_theory || "",
      knowledgeBase: Array.isArray(aiResult.knowledge_base)
        ? aiResult.knowledge_base
        : [],
      choicePrompt,
      status,
      endingPayload,
      suspicionScores: investigation.suspicionScores,
      forcedConclusion,
    });

    const segment = {
      narrative: narrativeBundle.narrative,
      options: optionsForDisplay,
      display: null,
      nextTurn: turn + 1,
      state: stateUpdateResult.state,
      stateDelta: stateUpdateResult.stateDelta,
      status,
      endingTrigger: null,
      playerAction: effectivePlayerAction,
      progress: detectiveProgress,
      keyPoints: resultKeyPoints,
      pendingThreads: resultPendingThreads,
      tone: resultTone,
      memorySummary,
      ai: {
        kind: "detective",
        scene: sceneLines,
        oneHardFact: aiResult.one_hard_fact || "",
        evidenceChainDelta: aiResult.evidence_chain_delta || "",
        workingTheory: aiResult.working_theory || "",
        knowledgeBase: Array.isArray(aiResult.knowledge_base)
          ? aiResult.knowledge_base
          : [],
        jsonStateUpdate: aiResult.json_state_update || {},
        nextActions: normalizedOptions,
        endingPayload,
        turnSummary: aiResult.working_theory || aiResult.one_hard_fact || "",
        suspicionScores: { ...investigation.suspicionScores },
        forcedConclusion,
        progress: detectiveProgress,
        keyPoints: resultKeyPoints,
        pendingThreads: resultPendingThreads,
        tone: resultTone,
        usage: usageInfo,
        memorySummary,
        sceneShiftRequired: Boolean(sceneShiftRequired),
        lastActionSummary,
      },
      lastActionSummary,
    };

    if (status === "ended") {
      segment.endingTrigger = "clue";
    }

    segment.ai.freeHint =
      status === "ended" ? "" : narrativeBundle.choicePrompt;

    return segment;
  }

  return produceSegment({ sceneShiftRequired: false, forceActionRetry: false });
}

function applyDetectiveStateUpdate({ investigation, update, session }) {
  const patchedUpdate = update || {};
  const clueProgress = patchedUpdate.clue_progress || {};
  const suspicionScores = patchedUpdate.suspicion_scores || {};

  if (Number.isFinite(clueProgress.value)) {
    investigation.clueProgress = clampStateValue(clueProgress.value);
  }

  if (Number.isFinite(clueProgress.delta)) {
    investigation.clueProgress = clampStateValue(
      (investigation.clueProgress || 0) + clueProgress.delta
    );
  }

  Object.entries(suspicionScores).forEach(([name, score]) => {
    if (Number.isFinite(score)) {
      investigation.suspicionScores[name] = Math.max(
        0,
        Math.min(100, Math.round(score))
      );
    }
  });

  if (Number.isFinite(patchedUpdate.time_remaining)) {
    investigation.timeRemaining = Math.max(
      0,
      Math.floor(patchedUpdate.time_remaining)
    );
  } else {
    investigation.timeRemaining = Math.max(investigation.timeRemaining - 1, 0);
  }

  if (Array.isArray(patchedUpdate.contradictions)) {
    investigation.contradictions = patchedUpdate.contradictions;
  }

  if (Array.isArray(patchedUpdate.found_evidence)) {
    const merged = new Set([
      ...investigation.foundEvidence,
      ...patchedUpdate.found_evidence,
    ]);
    investigation.foundEvidence = Array.from(merged);
  }

  session.state = session.state || {};
  if (Number.isFinite(investigation.clueProgress)) {
    session.state.clueProgress = investigation.clueProgress;
  }
  session.state.playerTrust = session.state.playerTrust ?? 50;
  session.state.dangerLevel = session.state.dangerLevel ?? 50;

  const stateDelta = {
    playerTrust: 0,
    clueProgress: Number.isFinite(clueProgress.delta) ? clueProgress.delta : 0,
    dangerLevel: 0,
  };

  return {
    state: session.state,
    stateDelta,
    progress: investigation.clueProgress,
  };
}

function composeDetectiveNarrative({
  turn,
  progress,
  sceneLines,
  hardFact,
  evidenceDelta,
  workingTheory,
  knowledgeBase,
  choicePrompt,
  status,
  endingPayload,
  suspicionScores,
  forcedConclusion,
}) {
  const lines = [];
  if (Number.isFinite(progress)) {
    const label = Math.max(0, Math.min(150, Math.round(progress)));
    lines.push(`╔════════ 進度 ${label}% ════════╗`);
  } else {
    lines.push(`╔════════ 查證記錄 ════════╗`);
  }

  if (Array.isArray(sceneLines) && sceneLines.length) {
    lines.push("【場景】");
    sceneLines.forEach((line) => {
      if (line) {
        lines.push(line);
      }
    });
    lines.push("");
  }

  if (hardFact) {
    lines.push(`【查證事實】${hardFact}`);
  }

  if (evidenceDelta) {
    lines.push(`【證據鏈】${evidenceDelta}`);
  }

  if (workingTheory) {
    lines.push(`【暫定推論】${workingTheory}`);
  }

  const knowledge = Array.isArray(knowledgeBase)
    ? knowledgeBase.filter(Boolean)
    : [];
  if (knowledge.length) {
    lines.push("【知識庫】");
    knowledge.forEach((item) => lines.push(`- ${item}`));
  }

  // 嫌疑權重保留於內部狀態，不再直接對玩家露出。

  let choiceLine = choicePrompt || "";

  if (status === "ended" && endingPayload) {
    lines.push("");
    if (
      forcedConclusion &&
      (!endingPayload.culprit || !endingPayload.evidence_chain?.length)
    ) {
      lines.push(
        "【辦案結果】證據不足以鎖定真兇，你原計畫的後續調查尚未完成；以下為依現有線索推估的暫定結局："
      );
    } else {
      lines.push("【破案結論】");
    }
    if (endingPayload.culprit) {
      lines.push(`兇手：${endingPayload.culprit}`);
    }
    if (endingPayload.motive) {
      lines.push(`動機：${endingPayload.motive}`);
    }
    if (endingPayload.method) {
      lines.push(`手法：${endingPayload.method}`);
    }
    if (endingPayload.opportunity) {
      lines.push(`機會：${endingPayload.opportunity}`);
    }

    const chain = Array.isArray(endingPayload.evidence_chain)
      ? endingPayload.evidence_chain.filter(Boolean)
      : [];
    if (chain.length) {
      lines.push("【證據鏈】");
      chain.forEach((item) => lines.push(`- ${item}`));
    }

    if (endingPayload.twist_explained) {
      lines.push(`【反轉說明】${endingPayload.twist_explained}`);
    }

    const epilogue = Array.isArray(endingPayload.epilogue)
      ? endingPayload.epilogue.filter(Boolean)
      : [];
    if (epilogue.length) {
      lines.push("");
      lines.push("【後續】");
      epilogue.forEach((item) => lines.push(item));
    }

    choiceLine = "";
  }

  if (choiceLine && status !== "ended") {
    lines.push("");
    lines.push(`💬 ${choiceLine}`);
  }

  return {
    narrative: lines.join("\n"),
    choicePrompt: choiceLine,
  };
}

function buildFallbackDetectiveEnding({ caseData, investigation }) {
  const suspects = Array.isArray(caseData?.suspects) ? caseData.suspects : [];
  const suspicionEntries = Object.entries(investigation?.suspicionScores || {});
  let topSuspectName = "未知嫌疑人";
  let topSuspectDetails = null;

  if (suspicionEntries.length) {
    suspicionEntries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
    topSuspectName = suspicionEntries[0][0];
    topSuspectDetails =
      suspects.find((suspect) => suspect?.name === topSuspectName) || null;
  }

  const fallbackChain = Array.isArray(investigation?.foundEvidence)
    ? investigation.foundEvidence.slice(-3)
    : [];

  const motive = topSuspectDetails?.motive
    ? `${topSuspectDetails.motive}（推定）`
    : "動機尚未查明，僅能推定與既有矛盾有關。";
  const method = topSuspectDetails?.means
    ? `${topSuspectDetails.means}（推定實施方式）`
    : "作案手法仍需進一步驗證。";
  const opportunity = topSuspectDetails?.opportunity
    ? `${topSuspectDetails.opportunity}（被列為可能時段）`
    : "缺乏明確作案時間，只能概略推測。";

  const twist = caseData?.twist
    ? `${caseData.twist}（尚待證實）`
    : "案件可能仍隱藏未揭露的身分或時間線誤導。";

  const epilogue = [
    "本次行動在證據未完全齊備的情況下被迫結束。",
    "調查小組建議將現有線索整理為補充報告，待取得新事證後續追查。",
    "仍未排除其他嫌疑人的可能性，所有假設需保留彈性。",
    "案卷與殘餘物證將送交鑑識，再次比對指紋與時間線。",
    "倦意與雨聲同時落下，你明白真相還在霧後靜靜等待。",
  ];

  return {
    culprit: `${topSuspectName}（推定）`,
    motive,
    method,
    opportunity,
    evidence_chain: fallbackChain.length
      ? fallbackChain
      : ["目前缺乏完整證據鏈，僅能保存既有線索以備後查。"],
    twist_explained: twist,
    epilogue,
  };
}

function finalizeIfComplete(session) {
  if (!session || !session.log.length) {
    return;
  }

  if (session.status === "completed") {
    const latestCompleted = session.log[session.log.length - 1];
    if (latestCompleted) {
      latestCompleted.options = [];
    }
    return;
  }

  const latest = session.log[session.log.length - 1];
  const progressDone = Number.isFinite(session.progress)
    ? session.progress >= 100
    : false;
  const noPending =
    !session.pendingThreads || session.pendingThreads.length === 0;
  const shouldComplete =
    latest.status === "ended" || (progressDone && noPending);

  if (shouldComplete) {
    session.status = "completed";
    latest.options = [];
  }
}

function buildSessionPayload(sessionId, session) {
  const latest = session.log.length
    ? session.log[session.log.length - 1]
    : null;

  return {
    sessionId,
    theme: session.theme,
    length: session.length,
    gender: session.gender || "male",
    turn: session.turn,
    maxTurns: session.maxTurns,
    status: session.status,
    progress: Number.isFinite(session.progress) ? session.progress : 0,
    keyPoints: session.keyPoints || [],
    pendingThreads: session.pendingThreads || [],
    tone: session.tone || "",
    storyLog: session.log.map((entry) => ({
      narrative: entry.narrative,
      playerAction: entry.playerAction || entry.actionResolved || "",
      usage: entry.ai?.usage || null,
      progress: Number.isFinite(entry.progress)
        ? entry.progress
        : entry.ai?.progress ?? session.progress ?? 0,
      keyPoints: entry.keyPoints || entry.ai?.keyPoints || [],
      pendingThreads: entry.pendingThreads || entry.ai?.pendingThreads || [],
      tone: entry.tone || entry.ai?.tone || "",
      memorySummary: entry.memorySummary || entry.ai?.memorySummary || "",
      lastActionSummary:
        entry.lastActionSummary || entry.ai?.lastActionSummary || "",
    })),
    latest: latest
      ? {
          narrative: latest.narrative,
          options: latest.options,
          display: latest.display,
          playerAction: latest.playerAction || latest.actionResolved || "",
          usage: latest.ai?.usage || null,
          progress: Number.isFinite(latest.progress)
            ? latest.progress
            : latest.ai?.progress ?? session.progress ?? 0,
          keyPoints: latest.keyPoints || latest.ai?.keyPoints || [],
          pendingThreads:
            latest.pendingThreads || latest.ai?.pendingThreads || [],
          tone: latest.tone || latest.ai?.tone || session.tone || "",
          memorySummary: latest.memorySummary || latest.ai?.memorySummary || "",
          lastActionSummary:
            latest.lastActionSummary || latest.ai?.lastActionSummary || "",
        }
      : null,
  };
}

app.post("/api/start", async (req, res) => {
  const {
    theme = "wuxia",
    length = "short",
    gender: rawGender = "male",
  } = req.body || {};
  const gender = normalizeGender(rawGender);

  if (!STORY_PREMISES[theme]) {
    return res.status(400).json({ error: "Unsupported theme" });
  }

  if (!Object.prototype.hasOwnProperty.call(STORY_LENGTH_TURNS, length)) {
    return res.status(400).json({ error: "Unsupported length" });
  }

  const sessionId = randomUUID();
  const maxTurns = STORY_LENGTH_TURNS[length];
  const session = {
    theme,
    length,
    gender,
    turn: 1,
    maxTurns,
    status: "in-progress",
    state: createInitialState(),
    premise: getPremise(theme, length),
    log: [],
    meta: {},
    progress: 0,
    keyPoints: [],
    pendingThreads: [],
    tone: getDefaultTone(theme),
  };

  try {
    if (session.theme === "detective") {
      await prepareDetectiveSession(session, { awaitBlueprint: false });
    }

    const introSegment = createIntroSegment({
      theme,
      turn: session.turn,
      state: session.state,
      premise: session.premise,
      maxTurns: session.maxTurns,
      detectiveCase: session.meta?.detective?.case,
    });

    session.log.push({
      narrative: introSegment.narrative,
      options: introSegment.options,
      display: introSegment.display,
      actionRaw: "SYSTEM_START",
      actionResolved: "故事開始",
      actionId: null,
      actionType: "system",
      actionIntent: "system",
      playerAction: introSegment.playerAction,
      state: introSegment.state,
      stateDelta: introSegment.stateDelta,
      status: introSegment.status,
      endingTrigger: introSegment.endingTrigger,
      progress: introSegment.progress,
      keyPoints: introSegment.keyPoints,
      pendingThreads: introSegment.pendingThreads,
      tone: introSegment.tone,
      ai: introSegment.ai,
      memorySummary: introSegment.memorySummary,
      lastActionSummary: introSegment.lastActionSummary || "",
    });

    session.turn = introSegment.nextTurn;
    session.progress = introSegment.progress ?? session.progress;
    session.keyPoints = introSegment.keyPoints
      ? dedupeList(introSegment.keyPoints)
      : session.keyPoints;
    session.pendingThreads = introSegment.pendingThreads
      ? dedupeList(introSegment.pendingThreads)
      : session.pendingThreads;
    session.tone = introSegment.tone || session.tone;
    finalizeIfComplete(session);

    sessions.set(sessionId, session);

    if (Number.isFinite(session.progress)) {
      console.log(`[progress][${sessionId}] ${Math.round(session.progress)}`);
    }

    res.json(buildSessionPayload(sessionId, session));
  } catch (error) {
    console.error("Failed to prepare intro segment:", error);
    res.status(500).json({ error: "Failed to start story session" });
  }
});

app.post("/api/next", async (req, res) => {
  const { sessionId, userInput } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.gender = normalizeGender(session.gender);

  if (session.status === "completed") {
    return res.json(buildSessionPayload(sessionId, session));
  }

  const action = normalizeUserAction(session, userInput);
  if (!action.raw) {
    return res.status(400).json({ error: "userInput is required" });
  }

  try {
    const segment =
      session.theme === "detective"
        ? await generateDetectiveStorySegment({ session, userAction: action })
        : await generateStorySegment({
            theme: session.theme,
            length: session.length,
            turn: session.turn,
            previousStory: session.log,
            maxTurns: session.maxTurns,
            state: session.state,
            premise: session.premise,
            userAction: action,
            progress: session.progress,
            keyPoints: session.keyPoints,
            pendingThreads: session.pendingThreads,
            tone: session.tone,
            gender: session.gender,
          });

    session.state = segment.state;
    session.log.push({
      narrative: segment.narrative,
      options: segment.options,
      display: segment.display,
      actionRaw: action.raw,
      actionResolved: action.resolved,
      actionId: action.id,
      actionType: action.type,
      actionIntent: action.intent,
      playerAction: segment.playerAction || action.resolved,
      state: segment.state,
      stateDelta: segment.stateDelta,
      status: segment.status,
      endingTrigger: segment.endingTrigger,
      progress: segment.progress,
      keyPoints: segment.keyPoints,
      pendingThreads: segment.pendingThreads,
      tone: segment.tone,
      ai: segment.ai,
      memorySummary: segment.memorySummary,
      lastActionSummary:
        segment.lastActionSummary || segment.ai?.lastActionSummary || "",
    });

    session.turn = segment.nextTurn;
    session.progress = Number.isFinite(segment.progress)
      ? segment.progress
      : session.progress;
    session.keyPoints = Array.isArray(segment.keyPoints)
      ? dedupeList(segment.keyPoints)
      : session.keyPoints;
    session.pendingThreads = Array.isArray(segment.pendingThreads)
      ? dedupeList(segment.pendingThreads)
      : session.pendingThreads;
    session.tone = segment.tone || session.tone;
    finalizeIfComplete(session);

    if (Number.isFinite(session.progress)) {
      console.log(`[progress][${sessionId}] ${Math.round(session.progress)}`);
    }

    res.json(buildSessionPayload(sessionId, session));
  } catch (error) {
    console.error("Failed to generate next segment:", error);
    res.status(500).json({ error: "Failed to generate story segment" });
  }
});

app.get("/api/state/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json(buildSessionPayload(sessionId, session));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Story engine API listening on port ${PORT}`);
  });
}

module.exports = {
  app,
  generateStorySegment,
  finalizeIfComplete,
  STORY_LENGTH_TURNS,
  STORY_PREMISES,
  THEME_PROFILES,
  createInitialState,
  normalizeUserAction,
  createIntroSegment,
  generateDetectiveStorySegment,
};
