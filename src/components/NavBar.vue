<template>
  <div class="no-wrap">
    <q-btn-dropdown
      v-if="!isAgent"
      flat
      no-caps
      icon="attach_money"
      style="text-decoration: none"
      :label="t('dashboard.交易')"
    >
      <q-list>
        <q-item
          clickable
          v-close-popup
          @click="
            () =>
              router.push({
                name: 'trade',
                query: { type: 'buy', action: 'create' },
              })
          "
        >
          <q-item-section>
            <q-item-label class="q-px-md">{{ t('buy.購買') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          @click="
            () =>
              router.push({
                name: 'trade',
                query: { type: 'sell', action: 'create' },
              })
          "
        >
          <q-item-section>
            <q-item-label class="q-px-md">{{ t('sell.出售') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      v-for="(feature, index) in features"
      :key="index"
      flat
      no-caps
      :icon="feature['icon']"
      style="text-decoration: none"
      @click="() => router.push({ name: feature.name })"
    >
      {{ t(`wallet.${feature.name}`) }}
    </q-btn>
    <q-btn
      v-if="isAgent"
      flat
      no-caps
      icon="credit_card"
      style="text-decoration: none"
      @click="() => router.push({ name: 'account' })"
    >
      {{ t(`account.account`) }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storageHelper } from 'src/utils/foragePkg';

const router = useRouter();
const { t } = useI18n();
// DOM
const isAgent = ref(storageHelper<boolean>('isAgent').getItem());
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

<style scoped>
.nav {
  display: flex;
}
</style>
