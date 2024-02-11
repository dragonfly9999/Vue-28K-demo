<template>
  <div class="overflow text-caption text-grey-5 text-center" :="$attrs">
    <div class="q-px-sm">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string | undefined;
}>();
</script>

<style scoped lang="scss">
div.overflow {
  overflow-x: auto;
  &::-webkit-scrollbar {
    visibility: hidden;
    height: 0;
  }
}
</style>
