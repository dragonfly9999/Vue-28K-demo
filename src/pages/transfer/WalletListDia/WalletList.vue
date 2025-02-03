<script setup lang="ts">
import { toRefs } from 'vue';

// Definition
const props = defineProps<{ active: boolean }>();
const emits = defineEmits(['update:active', 'set']);

// DOM
const {} = toRefs(props);
const walletList = Array(50).fill('TEZPF9NrUh9xQXqkNSyo7ngqoyfu8AmjQi');
</script>
<template>
  <q-list bordered separator style="max-height: 600px; scrollbar-width: thin">
    <q-item v-for="(wallet, index) in walletList" :key="`${wallet}-${index}`">
      <q-item-section>
        {{ wallet }}
      </q-item-section>
      <q-item-section avatar>
        <q-btn color="primary" @click="() => emits('set', wallet)">
          設定
        </q-btn>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped></style>
