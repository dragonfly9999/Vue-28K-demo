<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
import { maskString } from 'src/utils/TimeMaster';
import { useI18n } from 'vue-i18n';
defineProps<{ order: OrderStatus | undefined }>();
const emit = defineEmits(['upload', 'skip']);

const { t } = useI18n();
</script>
<template>
  <q-card class="q-pa-sm q-gutter-y-sm" style="width: 380px">
    <!-- title-請確認以下資訊 -->
    <div class="text-h6 text-center">
      {{ t('transaction.title_check_info') }}
    </div>
    <div>
      <!-- hint我已經按照轉帳資料，自行完成轉帳動作 -->
      <div class="flex items-start justify-center no-wrap">
        <q-icon name="check_box" color="green-9" size="xs" class="q-mr-xs" />
        <div>{{ t('warn.hint_check_info_1') }}</div>
      </div>
    </div>
    <!-- 轉帳資料 -->
    <div class="text-h6 text-weight-bold q-mx-sm text-primary">
      {{ t('buy.transfer_info') }}
    </div>
    <div class="mycolor1 q-pa-sm info td">
      <!-- 帶入轉帳資料 -->
      <table class="q-pa-xs">
        <tr
          v-for="(information, index) in [
            {
              title: t('transaction.amount'),
              content: thousandTool(order?.D2, 1)
            },
            {
              title: t('transaction.payee'),
              content: maskString(order?.P2, 1)
            },
            {
              title: t('transaction.account_number'),
              content:
                order?.Currency === 'CNY' ? maskString(order?.P1, 4) : order?.P1
            },
            {
              title: t(`transaction.bank_name`),
              content: order?.P3
            },
            {
              title: t(`transaction.code.${order?.Currency}`),
              content: order?.P4
            }
          ]"
          :key="index"
        >
          <td class="text-caption text-grey-8">{{ information.title }}:</td>
          <td class="text-caption text-weight-bold text-dark">
            {{ information.content }}
          </td>
        </tr>
      </table>
    </div>
    <!-- hint完成轉帳後，可上傳匯款憑證給收款方確認 -->
    <div class="text-center">
      {{ t('warn.hint_check_info_2') }}
    </div>

    <q-card-actions align="right" class="text-primary row">
      <!-- 上傳水單btn_選擇圖片 -->
      <q-btn
        class="col-12 col-md q-mt-md"
        glossy
        color="primary"
        :label="t('label.upload_image')"
        @click="() => emit('upload')"
      />
      <!-- 略過btn_進入下一個步驟 -->
      <q-btn
        class="col-12 col-md q-mt-md"
        outline
        color="primary"
        :label="t('label.skip')"
        @click="() => emit('skip')"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
