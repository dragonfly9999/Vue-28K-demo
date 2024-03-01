<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 380px">
    <!-- title-請確認以下資訊 -->
    <div class="text-h6 text-center text-weight-bold">
      {{ $t('transaction.title_check_info') }}
    </div>
    <!-- hint -->
    <div class="flex items-start justify-center no-wrap q-pa-md">
      <q-icon name="check_box" color="green-9" size="xs" class="q-mr-xs" />
      <div>{{ $t('sell.hint3') }}</div>
    </div>
    <!-- 付款方資料 -->
    <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
      {{ $t('transaction.sell_info') }}
    </div>
    <div class="mycolor1 q-pa-sm info td">
      <!-- 帶入付款方資料 -->
      <table class="q-pa-xs">
        <tr v-for="(information, index) in informations" :key="index">
          <td class="text-caption text-grey-8">{{ information.title }}:</td>
          <td class="text-caption text-weight-bold text-dark">
            {{ information.content }}
          </td>
        </tr>
      </table>
    </div>
    <!-- input備註(非必填) -->
    <!-- <q-input
      v-if="isAgent"
      v-model="remark"
      rounded
      color="blue-13"
      :label="$t('transaction.remark')"
    /> -->
    <q-card-actions align="right" class="text-blue-13">
      <!-- 確認收款btn -->
      <q-btn
        unelevated
        color="blue-13"
        class="full-width q-mt-md"
        :label="$t('sell.step_hint_sell_title_3')"
        @click="handleConfirm"
      />
      <!-- 返回btn-->
      <q-btn
        outline
        color="blue-13"
        class="full-width q-mt-md"
        :label="$t('label.close')"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useSellConfirm } from 'src/components/api/useSellConfirm';
import { thousandTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import api from '../api';
import { useStorage } from 'vue3-storage';
const props = defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const route = useRoute();
// DOM
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
// const remark = ref<string>();
const informations = computed(() => [
  {
    title: t('transaction.payee'),
    content: props?.order?.P5?.split('|')[0],
  },
  {
    title: t('transaction.amount'),
    content: thousandTool(props.order?.D2, 'CNY'),
  },
]);

// request
const { run: confirm } = useSellConfirm({});
const { run: sell } = api.useSell2({});
// handler
const handleConfirm = () => {
  if (isAgent.value) {
    confirm({
      Token: route.query.token as string,
    });
  } else {
    sell({
      Token: route.query.token as string,
    });
  }
};
</script>

<style scoped></style>
