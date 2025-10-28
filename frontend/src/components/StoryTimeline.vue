<template>
  <Motion
    tag="section"
    :initial="{ opacity: 0, y: 16 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.35, delay: 0.1 }"
    class="rounded-[16px] border border-sand/70 bg-white/85 p-5 shadow-latteSoft backdrop-blur-sm"
  >
    <header class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-cocoa">故事紀錄</h3>
      <span class="text-xs text-cocoaMuted/70">自動滾動顯示最近段落</span>
    </header>

    <div class="mt-4 max-h-80 space-y-4 overflow-y-auto pr-2">
      <div
        v-for="(entry, index) in game.storyLog"
        :key="index"
        class="relative rounded-[14px] border border-sand/70 bg-cream/90 p-4 text-sm text-cocoaMuted/90 shadow-latteSoft"
      >
        <div class="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.35rem] text-cocoa/45">
          <span>記錄 {{ index + 1 }}</span>
          <span v-if="index === game.storyLog.length - 1" class="text-latte">Latest</span>
        </div>
        <p class="whitespace-pre-line leading-relaxed">{{ entry.narrative }}</p>
        <p v-if="entry.playerAction" class="mt-3 text-xs text-cocoaMuted/70">
          【玩家行動】{{ entry.playerAction }}
        </p>
        <p v-if="entry.progress !== undefined" class="text-xs text-cocoaMuted/60">
          進度 {{ Math.round(entry.progress ?? 0) }}%
        </p>
      </div>

      <p v-if="!game.storyLog.length" class="text-sm text-cocoaMuted/70">
        故事尚未開始，請輸入行動或選擇選項。
      </p>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from '@motionone/vue';
import { useGameStore } from '../stores/gameStore';

const game = useGameStore();
</script>
