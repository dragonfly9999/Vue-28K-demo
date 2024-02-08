<template>
  <div class="bg-green-1 text-green-10 q-pa-md">
    {{ $t('kyc.listHint.approved') }}
  </div>
  <div class="row">
    <div
      v-for="(kycInfo, index) in approvedKycs"
      :key="index"
      class="col-12 col-md-4 col-sm-6"
    >
      <bank-card :kyc-info="kycInfo" />
    </div>
    <div class="col-12 col-md-4 col-sm-6">
      <q-btn
        outline
        color="primary"
        icon="add"
        class="q-mx-sm full-width full-height"
        stack
        @click="() => $router.push({ name: 'kyc_create' })"
        no-caps
      >
        {{ $t('新增帳戶') }}
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type FormatKycOptions } from '../api/useKycHistory';
import BankCard from './BankCard.vue';

const props = defineProps<{ tempKycs: Array<FormatKycOptions> }>();

const approvedKycs = computed(() =>
  props.tempKycs.filter((kycInfo) => kycInfo.User_BankStatus === 101)
);
</script>
<style scoped></style>
