<script setup lang="ts">
import CopyButton from 'src/components/CopyButton.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

defineProps<{
  walletType: number;
  img: string | undefined;
  address: string | undefined;
  loading: boolean;
}>();
const { t } = useI18n();
const router = useRouter();
</script>
<template>
  <div>
    <!-- 警示標題 -->
    <div class="flex no-wrap items-start bg-orange-1 q-pa-sm">
      <div style="color: orange; font-size: 24px" class="material-icons">
        warning
      </div>
      <div class="q-ml-sm">
        <div class="text-subtitle1 text-weight-bold text-orange-9">
          {{ t('wallet.label.warning_title') }}
        </div>
        <div>
          {{ t('wallet.label.warning_text_1') }}
          <br />
          {{ t('wallet.label.warning_text_2') }}
        </div>
      </div>
    </div>

    <div class="row justify-center items-center">
      <!-- body 錢包地址-->
      <div class="col-12 col-md">
        <div class="text-subtitle1 text-center q-my-md text-weight-bold">
          {{
            (walletType === 1 ? 'USDT-TRC20 ' : 'USDT-ERC20') +
            ' ' +
            t('wallet.label.address')
          }}
        </div>

        <div v-if="loading" class="q-ma-md justify-center flex">
          <q-spinner-cube color="blue-13" size="10em" />
        </div>
        <div v-else class="justify-center flex">
          <img
            style="width: 200px"
            :src="`data:image/png; base64,${img}`"
            alt="QR code"
          />
        </div>
      </div>
      <!-- 提示 -->
      <div class="col-12 col-md q-ma-md">
        <div class="flex no-wrap items-center justify-center">
          <q-icon name="info" color="grey-6" class="q-pa-xs" />
          <div class="text-grey-6">
            {{ t('wallet.label.hint') }}
          </div>
        </div>
        <div class="flex justify-center items-center q-mt-sm q-gutter-x-xs">
          <div
            class="text-caption bg-grey-2 q-pa-sm flex justify-between items-center rounded-borders overflow-auto hide-scrollbar"
          >
            <div v-if="loading">
              <q-spinner-cube color="blue-13" size="1.5em" />
            </div>
            <div v-else>
              {{ address }}
            </div>
            <CopyButton :value="address" />
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <div class="row justify-end">
      <!-- 查看紀錄btn -->
      <q-btn
        outline
        class="col-12 col-md-3 q-ml-md q-mt-md"
        color="blue-13"
        :label="t('wallet.label.record')"
        @click="() => router.push({ name: 'history' })"
      />
      <!-- 返回主頁btn -->
      <q-btn
        class="col-12 col-md-3 q-ml-md q-mt-md"
        color="blue-13"
        unelevated
        :label="t('wallet.label.back_front_page')"
        @click="() => router.push({ name: 'dashboard' })"
      />
    </div>
  </div>
</template>

<style scoped></style>
