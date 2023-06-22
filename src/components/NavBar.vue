<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';

const router = useRouter();
const { t } = useI18n();
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const features = computed(() => [
  {
    name: 'transfer',
    icon: 'move_up',
  },
  {
    name: 'wallet',
    icon: 'account_balance_wallet',
  },
  {
    name: 'history',
    icon: 'receipt_long',
  },
]);
</script>
<template>
  <q-btn-dropdown
    v-if="!isAgent"
    rounded
    no-caps
    icon="attach_money"
    style="text-decoration: none"
    :label="t('交易')"
  >
    <q-list>
      <q-item
        clickable
        v-close-popup
        @click="() => router.push({ name: 'buy' })"
      >
        <q-item-section>
          <q-item-label class="q-px-md">{{ t('購買') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-close-popup
        @click="() => router.push({ name: 'sell' })"
      >
        <q-item-section>
          <q-item-label class="q-px-md">{{ t('出售') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
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
  <q-btn
    v-if="isAgent"
    rounded
    no-caps
    icon="credit_card"
    style="text-decoration: none"
    @click="() => router.push({ name: 'account' })"
  >
    {{ t(`label.account`) }}
  </q-btn>
</template>

<style scoped></style>
