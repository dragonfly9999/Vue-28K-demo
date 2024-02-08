<template>
  <q-card class="q-pa-md q-ma-sm" flat bordered>
    <!-- 銀行戶名 -->
    <div class="field">
      <span class="text-grey-6 text-caption">
        {{ $t('kyc.銀行戶名') }}
      </span>
      <span class="text-right">{{ kycInfo?.P1 }}</span>
    </div>
    <!--省分-->
    <div class="field">
      <span class="text-grey-6 text-caption">
        {{ $t('kyc.省分') }}
      </span>
      <span class="text-right">{{ kycInfo?.P3 }}</span>
    </div>
    <!-- 銀行帳號 -->
    <div class="field">
      <span class="text-grey-6 text-caption">
        {{ $t('kyc.銀行帳號') }}
      </span>
      <span class="text-right">{{ kycInfo?.P4 }}</span>
    </div>
    <!-- 狀態 -->
    <div class="field">
      <span class="text-grey-6 text-caption">
        {{ $t('kyc.狀態') }}
      </span>
      <div class="flex items-center">
        <!-- 通過驗證icon -->
        <q-icon
          name="check_circle"
          class="q-mr-xs"
          color="green"
          v-if="kycInfo.User_BankStatus === 101"
        />
        <!-- 審核中icon -->
        <q-icon
          name="search"
          class="q-mr-xs"
          color="orange"
          v-else-if="kycInfo.User_BankStatus === 1"
        />
        <!-- 未通過驗證icon -->
        <q-icon name="cancel" class="q-mr-xs" color="red" v-else />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { type FormatKycOptions } from '../api/useKycHistory';

defineProps<{ kycInfo: FormatKycOptions }>();
</script>


<style scoped lang="scss">
div.field {
  border-bottom: 0.25px dashed #eeeeee;
  display: flex;
  justify-content: space-between;
}
</style>
