<template>
  <Motion
    tag="aside"
    :initial="{ opacity: 0, x: 22 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ duration: 0.4, easing: 'ease-out' }"
    class="rounded-[16px] border border-sand/70 bg-white/95 p-6 shadow-latteSoft backdrop-blur-sm"
  >
    <header class="space-y-1">
      <h3 class="text-xl font-semibold text-cocoa">行動指令</h3>
      <p class="text-xs uppercase tracking-[0.35rem] text-cocoa/45">Input / Choices</p>
      <p class="text-xs text-cocoaMuted/75">請使用第一人稱描述（例如：「我要...」、「我決定...」）。</p>
    </header>

    <form class="mt-5 flex flex-col gap-4" @submit.prevent="handleSubmit">
      <label class="text-sm text-cocoaMuted/85">
        自由輸入
        <textarea
          v-model="draft"
          rows="4"
          placeholder="以「我」開頭描述你的行動、對話或策略..."
          class="mt-2 w-full rounded-[14px] border border-sand bg-cream/70 px-4 py-3 text-sm text-cocoa placeholder:text-cocoa/40 focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/40 disabled:bg-sand/30"
          :disabled="game.loading || game.isComplete"
        />
      </label>

      <div v-if="optionButtons.length" class="space-y-2">
        <div class="text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70">建議選項</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in optionButtons"
            :key="option"
            type="button"
            class="rounded-full border border-latte/60 bg-latte/10 px-4 py-2 text-xs font-medium text-cocoa transition-colors duration-300 ease-in-out hover:border-latte hover:bg-latte/20"
            @click="useOption(option)"
            :disabled="game.loading || game.isComplete"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs text-cocoaMuted/70">進度 {{ game.progressLabel }}%</span>
        <button
          type="submit"
          class="rounded-full bg-latte px-5 py-2 text-sm font-semibold text-white shadow-latte transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60"
          :disabled="!draft.trim() || game.loading || game.isComplete"
        >
          {{ game.loading ? '生成中…' : game.isComplete ? '故事已完結' : '送出行動' }}
        </button>
      </div>
    </form>
  </Motion>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Motion } from '@motionone/vue';
import { useGameStore } from '../stores/gameStore';

const game = useGameStore();
const draft = ref('');

const optionButtons = computed(() => game.latest?.options ?? []);

function useOption(option: string) {
  if (game.loading || game.isComplete) {
    return;
  }
  draft.value = option.replace(/^[A-C]\.\s?/, '');
  handleSubmit();
}

function handleSubmit() {
  if (!draft.value.trim() || game.loading || game.isComplete) {
    return;
  }
  game.submitInput(draft.value.trim());
  draft.value = '';
}
</script>
