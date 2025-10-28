<template>
  <div class="app-shell" :style="backgroundStyle">
    <div class="app-shell__scrim" />
    <div class="app-shell__content">
      <div
        class="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:py-16"
      >
        <header class="text-center">
          <h1
            class="text-4xl font-semibold tracking-tight text-cocoa md:text-5xl"
          >
            互動式故事體驗
          </h1>
          <p class="mt-4 text-base text-cocoa/80 md:text-lg">
            選擇主題，讓故事依照劇情完整度自然延展，編織專屬劇情。
          </p>
        </header>

        <main class="flex flex-1 flex-col gap-8 lg:flex-row">
          <section class="flex-1 space-y-6">
            <ThemeSelector v-if="!game.isReady" />

            <template v-if="game.isReady">
              <StoryPanel />

              <StoryTimeline />

              <div
                v-if="game.isComplete"
                class="rounded-[16px] border border-sand/70 bg-white/92 p-6 shadow-latteSoft backdrop-blur-sm"
              >
                <h3 class="text-lg font-semibold text-cocoa">
                  想再來一段故事嗎？
                </h3>
                <p class="mt-2 text-sm text-cocoaMuted/80">
                  結局已經寫下，但俠骨、真相、求生與青春仍在等你。回到主題選單，挑戰另一種命運。
                </p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    class="rounded-full bg-latte px-5 py-2 text-sm font-semibold text-white shadow-latteSoft transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white"
                    @click="handleRestart"
                  >
                    重新選擇主題
                  </button>
                </div>
              </div>
            </template>
          </section>

          <interaction-panel
            v-if="game.isReady && !game.isComplete"
            class="w-full max-w-md self-start lg:sticky lg:top-16"
          />
        </main>

        <footer
          class="flex flex-wrap items-center justify-between gap-4 text-xs text-cocoa/60"
        >
          <div class="flex items-center gap-2">
            <span>Prototype POC</span>
            <span v-if="game.isReady">· 進度：{{ progressLabel }}%</span>
          </div>
          <button
            v-if="game.isReady && !game.isComplete"
            class="rounded-full border border-sand px-4 py-2 text-sm font-medium text-cocoa transition-colors duration-300 ease-in-out hover:border-latte hover:text-latte"
            @click="game.resetGame"
          >
            中止故事
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "./stores/gameStore";
import ThemeSelector from "./components/ThemeSelector.vue";
import StoryPanel from "./components/StoryPanel.vue";
import StoryTimeline from "./components/StoryTimeline.vue";
import InteractionPanel from "./components/InteractionPanel.vue";
import { themeBackgrounds, type ThemeKey } from "./themeAssets";

const game = useGameStore();
const progressLabel = computed(() =>
  Math.max(0, Math.min(100, Math.round(game.progress ?? 0)))
);

function handleRestart() {
  game.resetGame();
  if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

const backgroundStyle = computed(() => {
  const themeKey = (game.theme as ThemeKey) || "wuxia";
  const theme = themeBackgrounds[themeKey] || themeBackgrounds.wuxia;
  return {
    "--theme-gradient": theme.gradient,
    "--theme-image": `url(${theme.imageUrl})`,
    "--theme-base-color": theme.baseColor,
    "--theme-text-color": theme.textColor,
    "--theme-scrim-start": theme.scrimStart,
    "--theme-scrim-end": theme.scrimEnd,
    "--theme-image-opacity": theme.imageOpacity,
  } as Record<string, string>;
});
</script>
