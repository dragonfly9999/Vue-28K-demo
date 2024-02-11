<template>
  <q-img
    @click="() => (isFullScreen = true)"
    :src="src"
    :width="width"
    :height="height"
    @load="(file) => $emit('load', file)"
  />
  <q-dialog maximized v-model="isFullScreen">
    <div class="background" @click="isFullScreen = false">
      <q-btn
        v-close-popup
        class="bg-white fixed-top-right"
        dense
        unelevated
        icon="close"
      />
      <div class="container">
        <q-img :src="src" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ src: string; width?: string; height?: string }>();
defineEmits(['load']);
const isFullScreen = ref(false);
</script>

<style scoped>
.background {
  width: 100vw;
  min-height: 100vh;
  padding: 3.5vh 4vw;
  border: 5px solid black;
}

.container {
  border: 2px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #f76d6d, #ff9494); /* 渐变色 */
}
</style>
