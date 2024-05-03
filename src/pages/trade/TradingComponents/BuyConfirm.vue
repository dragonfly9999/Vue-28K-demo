<template>
  <q-dialog
    trnasition-show="fade"
    trnasition-hide="fade"
    :model-value="visible"
    @update:model-value="(isVisible) => $emit('update:visible', isVisible)"
  >
    <q-card class="q-pa-sm q-gutter-y-sm" style="width: 380px">
      <!-- title-請確認以下資訊 -->
      <div class="text-h6 text-center text-weight-bold">
        {{ $t('transaction.title_check_info') }}
      </div>
      <div>
        <!-- hint我已經按照轉帳資料，自行完成轉帳動作 -->
        <div class="flex items-start justify-center no-wrap">
          <q-icon name="check_box" color="green-9" size="xs" class="q-mr-xs" />
          <div>{{ $t('warn.hint_check_info_1') }}</div>
        </div>
      </div>
      <!-- 轉帳資料 -->
      <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
        {{ $t('buy.transfer_info') }}
      </div>
      <div class="mycolor1 q-pa-sm info td">
        <!-- 帶入轉帳資料 -->
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: $t('transaction.amount'),
                content: thousandTool(order?.D2, 'CNY'),
              },
              {
                title: $t('transaction.payee'),
                content: order?.P2,
              },
              {
                title: $t('transaction.account_number'),
                content: order?.P1,
              },
              {
                title: $t(`transaction.bank_name`),
                content: order?.P3,
              },
              {
                title: $t(`transaction.code.${order?.Currency}`),
                content: order?.P4,
              },
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
        {{ $t('warn.hint_check_info_2') }}
      </div>

      <q-card-actions align="right" class="text-blue-13 row">
        <!-- 上傳水單btn_選擇圖片 -->
        <q-btn
          class="col-12 col-md q-mt-md"
          unelevated
          color="blue-13"
          :label="$t('main.upload_image')"
          @click="() => $emit('upload')"
        />
        <!-- 略過btn_進入下一個步驟 -->
        <q-btn
          class="col-12 col-md q-mt-md"
          outline
          color="blue-13"
          :label="$t('main.skip')"
          @click="() => $emit('skip')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
defineProps<{ order: OrderStatus | undefined; visible: boolean }>();
defineEmits(['upload', 'skip', 'update:visible']);
</script>

<style scoped></style>
