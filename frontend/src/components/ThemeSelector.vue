<template>
  <Motion
    tag="div"
    :initial="{ opacity: 0, y: 32 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4, easing: 'ease-out' }"
    class="rounded-[16px] border border-sand/70 bg-white/90 p-8 shadow-latteSoft backdrop-blur-sm"
  >
    <form class="flex flex-col gap-7" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold text-cocoa">開啟新章節</h2>
        <p class="text-sm text-cocoa/70">選擇主題，即可開始與 AI 的沉浸式共筆旅程。</p>
      </div>

      <fieldset>
        <legend class="mb-3 text-xs font-semibold uppercase tracking-[0.35rem] text-cocoa/50">故事主題</legend>
        <div class="grid gap-3 md:grid-cols-2">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            type="button"
            :class="[
              'rounded-[16px] border px-5 py-4 text-left transition-colors duration-300 ease-in-out',
              theme === option.value
                ? 'border-latte bg-latte/10 text-cocoa shadow-latte'
                : 'border-sand/60 bg-white/70 text-cocoa/80 hover:border-latte/70 hover:bg-cream'
            ]"
            @click="theme = option.value"
          >
            <h3 class="text-lg font-semibold">{{ option.label }}</h3>
            <p class="mt-2 text-sm text-cocoa/65">{{ option.description }}</p>
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend class="mb-3 text-xs font-semibold uppercase tracking-[0.35rem] text-cocoa/50">扮演視角</legend>
        <div class="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            :class="[
              'rounded-[16px] border px-5 py-3 text-left transition-colors duration-300 ease-in-out',
              gender === 'male'
                ? 'border-latte bg-latte/10 text-cocoa shadow-latte'
                : 'border-sand/60 bg-white/70 text-cocoa/80 hover:border-latte/70 hover:bg-cream'
            ]"
            @click="gender = 'male'"
          >
            <h3 class="text-lg font-semibold">男生視角</h3>
            <p class="mt-2 text-sm text-cocoa/65">以豪爽而堅定的第一人稱語氣推進劇情。</p>
          </button>
          <button
            type="button"
            :class="[
              'rounded-[16px] border px-5 py-3 text-left transition-colors duration-300 ease-in-out',
              gender === 'female'
                ? 'border-latte bg-latte/10 text-cocoa shadow-latte'
                : 'border-sand/60 bg-white/70 text-cocoa/80 hover:border-latte/70 hover:bg-cream'
            ]"
            @click="gender = 'female'"
          >
            <h3 class="text-lg font-semibold">女生視角</h3>
            <p class="mt-2 text-sm text-cocoa/65">以細膩柔和的第一人稱語氣描寫心情。</p>
          </button>
        </div>
      </fieldset>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <span v-if="game.error" class="text-sm text-rose-500">{{ game.error }}</span>
        <button
          type="submit"
          class="ml-auto rounded-full bg-latte px-6 py-2 text-sm font-semibold text-white shadow-latteSoft transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60"
          :disabled="game.loading || backgroundLoading"
        >
          {{ backgroundLoading ? '載入背景…' : game.loading ? '建立中…' : game.isReady ? '重新開始' : '開始冒險' }}
        </button>
      </div>
    </form>
  </Motion>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Motion } from '@motionone/vue';
import { useGameStore } from '../stores/gameStore';
import { preloadThemeBackground, type ThemeKey } from '../themeAssets';

type ThemeOption = {
  value: 'wuxia' | 'detective' | 'apocalypse' | 'school';
  label: string;
  description: string;
};

const themeOptions: ThemeOption[] = [
  { value: 'wuxia', label: '武俠冒險', description: '江湖風起雲湧，俠骨柔情一念之間。' },
  { value: 'detective', label: '偵探推理', description: '解開謎團的唯一線索，就藏在細節裡。' },
  { value: 'apocalypse', label: '末日生存', description: '在文明瓦解後，尋找仍存的希望。' },
  { value: 'school', label: '青春校園', description: '日常裡的悸動與秘密，悄悄延伸。' },
];

const theme = ref<ThemeOption['value']>('wuxia');
const gender = ref<'male' | 'female'>('male');
const game = useGameStore();
const backgroundLoading = ref(false);

async function handleSubmit() {
  if (game.loading || backgroundLoading.value) {
    return;
  }
  const themeKey = theme.value as ThemeKey;
  backgroundLoading.value = true;
  try {
    await preloadThemeBackground(themeKey);
  } finally {
    backgroundLoading.value = false;
  }
  game.startNewGame({ theme: theme.value, gender: gender.value });
}

watch(
  () => game.gender,
  (newGender) => {
    if (newGender === 'female' || newGender === 'male') {
      gender.value = newGender;
    }
  },
  { immediate: true }
);

watch(
  () => game.theme,
  (newTheme) => {
    if (newTheme && ['wuxia', 'detective', 'apocalypse', 'school'].includes(newTheme)) {
      theme.value = newTheme as ThemeOption['value'];
    }
  },
  { immediate: true }
);
</script>
