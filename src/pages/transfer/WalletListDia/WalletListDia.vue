<script setup lang="ts">
import { toRefs } from 'vue';
import WalletList from './WalletList.vue';
// Definition
const props = defineProps<{ open: boolean }>();
const emits = defineEmits(['update:open', 'set']);
// DOM
const { open } = toRefs(props);
</script>
<template>
  <q-dialog
    :model-value="open"
    @update:model-value="(isOpen) => emits('update:open', isOpen)"
  >
    <q-card>
      <WalletList
        v-model:active="open"
        @set="(setWallet) => emits('set', setWallet)"
      />
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
