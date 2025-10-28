<template>
  <p class="whitespace-pre-line text-lg leading-relaxed text-cocoa font-medium">
    {{ currentText }}
  </p>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 18,
  },
});

const currentText = ref('');
let timer: ReturnType<typeof setTimeout> | null = null;

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function typeOut(target: string, index = 0) {
  clearTimer();
  if (index >= target.length) {
    currentText.value = target;
    return;
  }

  currentText.value = target.slice(0, index + 1);
  timer = setTimeout(() => typeOut(target, index + 1), props.speed);
}

watch(
  () => props.text,
  (value) => {
    if (!value) {
      currentText.value = '';
      clearTimer();
      return;
    }
    typeOut(value, 0);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTimer();
});
</script>
