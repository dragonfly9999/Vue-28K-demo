<template>
  <div class="width900">
    <div class="row">
      <!-- 返回 -->
      <div class="col-3">
        <q-btn
          flat
          color="blue-13"
          :label="t('label.back')"
          @click="() => router.back()"
        />
      </div>
      <!-- 標題-我的錢包 -->
      <div class="col flex justify-center text-h6 text-weight-bold">
        {{ $t('wallet.title') }}
      </div>
      <div class="col-3"></div>
    </div>
    <q-card class="q-pa-sm q-mx-sm myshadow" style="border-radius: 15px">
      <BalanceComponent />
    </q-card>

    <q-card class="q-mx-sm q-mt-md q-mb-lg myshadow">
      <q-tabs
        v-model="tab"
        inline-label
        align="justify"
        class="bg-grey-1 text-grey"
        active-color="blue-13"
        indicator-color="blue-13"
        :breakpoint="0"
      >
        <q-tab name="TRC20" label="TRC20" />
        <q-tab name="ERC20" label="ERC20" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="TRC20" class="q-gutter-y-md">
          <QR
            :walletType="1"
            :img="wallet?.Qr_img2"
            :address="wallet?.WalletAddress2"
            :loading="loading"
          />
        </q-tab-panel>
        <q-tab-panel name="ERC20" class="q-gutter-y-md">
          <QR
            :walletType="2"
            :address="wallet?.WalletAddress"
            :img="wallet?.Qr_img"
            :loading="loading"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import BalanceComponent from './components/BalanceComponent.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useWallet } from './api';
import QR from './components/QR.vue';

const { t } = useI18n();
const router = useRouter();
const { data: wallet, loading } = useWallet();
// DOM
const tab = ref('TRC20');
</script>

<style scoped></style>
