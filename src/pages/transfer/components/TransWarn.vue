<template>
  <q-card class="q-pa-md" style="width: 380px">
    <!-- title-請確認訂單資訊 -->
    <div class="flex items-center justify-center q-gutter-x-sm">
      <q-icon size="sm" name="checklist_rtl " color="blue-13" />
      <div class="text-h6 text-center text-weight-bold">
        {{ $t('transfer.check.title') }}
      </div>
    </div>
    <div class="flex no-wrap items-start bg-orange-1 q-pa-sm q-mt-sm">
      <div style="color: orange; font-size: 24px" class="material-icons">
        warning
      </div>
      <div class="q-ml-sm">
        <!-- 警示標題 -->
        <div class="text-subtitle1 text-weight-bold text-orange-9">
          {{ $t('warn.wallet1') }}
        </div>
        <!-- 警示內文 -->
        <div>
          {{ $t('warn.wallet2') }}
          <br />
          {{ $t('warn.wallet3') }}
        </div>
      </div>
    </div>

    <main>
      <q-list>
        <!-- 協議種類 -->
        <q-item>
          <q-item-section class="text-grey-6">
            {{ $t('transfer.check.agreement') }}
          </q-item-section>
          <q-item-section avatar>
            {{
              addressOptions?.find((address) => address?.value === agreement)
                ?.label
            }}
          </q-item-section>
        </q-item>
        <!-- 地址 -->
        <q-item class="no-wrap">
          <q-item-section class="text-grey-6">
            {{ $t('transfer.check.address') }}
          </q-item-section>
          <q-item-section avatar class="text-right">
            {{ address?.substring(0, 19) }}<br />
            <div class="row">
              {{ address?.substring(19) }}
            </div>
          </q-item-section>
        </q-item>
        <!-- 地址備註 -->
        <q-item v-if="useStorage().getStorageSync('isAgent')">
          <q-item-section class="text-grey-6">
            {{ $t('transfer.check.remark') }}
          </q-item-section>
          <q-item-section avatar>
            {{ remark ?? '--' }}
          </q-item-section>
        </q-item>
        <!-- 轉出數量 -->
        <q-item>
          <q-item-section class="text-grey-6">
            {{ $t('transfer.check.transferAmt') }}
          </q-item-section>
          <q-item-section avatar>
            {{ transAmt }}
          </q-item-section>
        </q-item>

        <!-- 輸入密碼 -->
        <q-item class="flex justify-between items-baseline">
          <section class="text-grey-6">
            {{ $t('transfer.label.verify_password') }}
          </section>
          <section class="text-weight-bold">
            <q-input
              dense
              outlined
              v-model="password"
              @keyup.enter="handleVerifyPassword"
              :type="isPassword ? 'password' : 'text'"
              :style="{
                'max-width': '160px',
              }"
              @update:model-value="() => (isPasswordError = false)"
              @blur="() => (isPasswordError = false)"
              :error="isPasswordError ? true : undefined"
              :error-message="t('error.password')"
            >
              <template v-slot:append>
                <q-btn
                  @click="() => (isPassword = !isPassword)"
                  :icon="isPassword ? 'visibility_off' : 'visibility'"
                  dense
                  rounded
                  unelevated
                  size="small"
                />
              </template>
            </q-input>
          </section>
        </q-item>

        <!-- 輸入2FA -->
        <q-item
          v-if="isEnabled"
          class="flex justify-between items-baseline q-mb-sm"
        >
          <section class="text-grey-6">2FA:</section>
          <section class="text-weight-bold">
            <q-input
              dense
              outlined
              v-model="twoFa"
              @keyup.enter="handleVerifyPassword"
              :style="{
                'max-width': '160px',
              }"
              :error="!!twoFaErrorMessage ? true : undefined"
              :error-message="twoFaErrorMessage"
              @update:model-value="() => (twoFaErrorMessage = undefined)"
              @blur="() => (twoFaErrorMessage = undefined)"
            />
          </section>
        </q-item>
      </q-list>

      <div
        class="flex text-blue-13 justify-end q-px-md"
        :style="{ gap: '6px' }"
      >
        <!-- 取消btn -->
        <q-btn
          :loading="loadingTransErc || loadingTransTrc"
          outline
          color="blue-13"
          :label="t('btn.cancel')"
          v-close-popup
          style="min-width: 80px"
        />
        <!-- 確認轉出btn -->
        <q-btn
          :loading="loadingTransErc || loadingTransTrc"
          :disable="!password?.length"
          unelevated
          color="blue-13"
          :label="t('btn.confirm_transfer')"
          @click="handleVerifyPassword"
          style="min-width: 80px"
        />
      </div>
    </main>
  </q-card>
</template>

<script setup lang="ts">
import { numberTool } from 'src/utils/NumberTool';
import { addressOptions } from '../data';
import { useI18n } from 'vue-i18n';
import { ref, toRefs } from 'vue';
import { useStorage } from 'vue3-storage';
import api from '../api';
import { use2faStore, useStateStore } from 'src/stores';

// Definition
const emits = defineEmits(['success']);
const props = defineProps<{
  agreement?: string;
  address?: string;
  remark?: string;
  transAmt?: string;
  premium?: string;
}>();
//
const { t } = useI18n();

// Queries
const onSuccess = () => {
  useStateStore().balanceRequest.refresh();
  emits('success');
};
const { run: transTrc, loading: loadingTransTrc } = api.useTransTrc({
  onSuccess,
});
const { run: transErc, loading: loadingTransErc } = api.useTransErc({
  onSuccess,
});

// DOM
const password = ref();
const isPassword = ref(true);
const isPasswordError = ref(false);
const twoFa = ref();
const twoFaErrorMessage = ref<string>();
const { isEnabled } = toRefs(use2faStore());

// handlers
const handleVerifyPassword = () => {
  if (
    !password.value ||
    password.value !== useStorage().getStorageSync('password')
  ) {
    isPasswordError.value = true;
    return;
  }
  switch (props.agreement) {
    case 'trc': {
      transTrc({
        ToAddress: props.address as string,
        UsdtAmt: numberTool(props.transAmt),
        OTP: isEnabled.value ? twoFa.value : undefined,
        ClientRemark: props.remark,
      });
      break;
    }
    case 'erc': {
      transErc({
        ToAddress: props.address as string,
        UsdtAmt: numberTool(props.transAmt),
        OTP: isEnabled.value ? twoFa.value : undefined,
        ClientRemark: props.remark,
      });
      break;
    }
    default:
      return undefined;
  }
};
</script>

<style scoped></style>
