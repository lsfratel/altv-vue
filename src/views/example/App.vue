<script lang="ts" setup>
</script>

<template>
  <div :class="$style.wrapper">
    <h1 :class="$style.h1">Example WEBVIEW!</h1>
  </div>
</template>

<style module>
.wrapper {
  @apply w-screen h-screen;
  @apply flex items-center justify-center;
  @apply bg-neutral-950/85;
}

.h1 {
  @apply text-white;
  @apply text-3xl;
}
</style>
