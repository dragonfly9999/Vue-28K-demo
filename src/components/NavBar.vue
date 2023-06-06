<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const features = computed(() => [
  {
    name: 'transfer',
    icon: 'move_up'
  },
  {
    name: 'wallet',
    icon: 'account_balance_wallet'
  },
  {
    name: 'history',
    icon: 'receipt_long'
  },
  {
    name: 'account',
    icon: 'credit_card'
  }
]);
</script>
<template>
  <q-btn
    v-for="(feature, index) in features"
    :key="index"
    rounded
    no-caps
    :icon="feature['icon']"
    style="text-decoration: none"
    @click="() => router.push({ name: feature.name })"
  >
    {{ t(`label.${feature.name}`) }}
  </q-btn>
</template>

<style scoped></style>
