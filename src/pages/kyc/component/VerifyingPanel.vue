<template>
  <div class="bg-green-1 text-green-10 q-pa-md">
    {{ $t('kyc.listHint.verifing') }}
  </div>
  <div class="row">
    <div
      v-for="(kycInfo, index) in verifyingKycs"
      :key="index"
      class="col-12 col-md-4 col-sm-6"
    >
      <bank-card :kyc-info="kycInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type FormatKycOptions } from '../api/useKycHistory';
import BankCard from './BankCard.vue';

const props = defineProps<{ tempKycs: Array<FormatKycOptions> | undefined }>();

const verifyingKycs = computed(() => {
  if (!props.tempKycs) return [];
  return props.tempKycs.filter((kycInfo) => kycInfo.User_BankStatus === 1);
});
</script>
<style scoped></style>
