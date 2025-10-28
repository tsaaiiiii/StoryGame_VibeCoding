<template>
  <Motion
    tag="article"
    :initial="{ opacity: 0, y: 16 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.35 }"
    class="relative overflow-hidden rounded-[16px] border border-sand/70 bg-white/92 p-6 shadow-latteSoft backdrop-blur-sm"
  >
    <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-latte/20 blur-3xl" />
    <header class="flex items-baseline justify-between">
      <div>
        <h2 class="text-xl font-semibold text-cocoa">目前劇情</h2>
        <p class="text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70">
          進度 {{ progressLabel }}%
        </p>
      </div>
      <span
        class="rounded-full border border-sand px-3 py-1 text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70"
      >
        {{ statusLabel }}
      </span>
    </header>

    <div class="mt-6 space-y-4">
      <div v-if="latestDisplay" class="space-y-3">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.4rem] text-latte">{{ latestDisplay.sceneTitle }}</p>
          <TypingText :text="displaySceneText" />
        </div>
        <p v-if="latestDisplay.recap" class="text-xs text-cocoaMuted/70">{{ latestDisplay.recap }}</p>
        <p class="text-base text-cocoa font-medium">{{ latestDisplay.interaction }}</p>
        <p class="text-sm italic text-cocoaMuted/80">{{ latestDisplay.progress }}</p>
      </div>

      <TypingText v-else-if="game.latest" :text="game.latest.narrative" />

      <p v-else class="text-sm text-cocoaMuted/75">請以第一人稱輸入行動或對話，讓故事繼續發展。</p>

      <ul v-if="displayOptions.length" class="space-y-2 text-sm text-cocoaMuted/85">
        <li
          v-for="option in displayOptions"
          :key="option"
          class="rounded-[12px] border border-latte/50 bg-latte/10 px-3 py-2"
        >
          {{ option }}
        </li>
      </ul>

      <p v-if="playerAction" class="pt-2 text-sm text-cocoaMuted/70">
        【玩家行動】{{ playerAction }}
      </p>

      <div v-if="game.pendingThreads.length" class="rounded-[12px] bg-cream/70 p-4 text-sm text-cocoaMuted/85">
        <p class="text-xs font-semibold uppercase tracking-[0.25rem] text-cocoaMuted/60">未決線索</p>
        <ul class="mt-2 space-y-1">
          <li v-for="thread in game.pendingThreads" :key="thread">- {{ thread }}</li>
        </ul>
      </div>

      <div v-if="game.keyPoints.length" class="rounded-[12px] bg-cream/70 p-4 text-sm text-cocoaMuted/85">
        <p class="text-xs font-semibold uppercase tracking-[0.25rem] text-cocoaMuted/60">重點摘要</p>
        <ul class="mt-2 space-y-1">
          <li v-for="point in game.keyPoints" :key="point">- {{ point }}</li>
        </ul>
      </div>

      <p v-if="game.tone" class="text-xs text-cocoaMuted/60">【氛圍】{{ game.tone }}</p>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Motion } from '@motionone/vue';
import TypingText from './TypingText.vue';
import { useGameStore } from '../stores/gameStore';

const game = useGameStore();

const statusLabel = computed(() => {
  if (game.isComplete) {
    return 'Completed';
  }
  if (game.isActive) {
    return 'In Progress';
  }
  return 'Ready';
});

const displayOptions = computed(() => game.latest?.options ?? []);
const latestDisplay = computed(() => game.latest?.display ?? null);
const displaySceneText = computed(() => {
  if (!latestDisplay.value) {
    return '';
  }
  return latestDisplay.value.background.join('\n');
});
const playerAction = computed(() => game.latest?.playerAction ?? '');
const progressLabel = computed(() => Math.max(0, Math.min(100, Math.round(game.progress))));
</script>
