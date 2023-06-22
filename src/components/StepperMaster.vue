<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum } from 'src/utils/NumberTool';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps<{ order?: OrderStatus }>();

const { t } = useI18n();
const stepFormat = computed(() => {
  switch (props.order?.Order_StatusID) {
    case undefined:
      return 1;
    case OrderStatusNum.Assigned:
      return 2;
    case OrderStatusNum.Committed:
      return 3;
    case OrderStatusNum.Complete:
      return 4;
    case OrderStatusNum.Appeal:
      return 2;
    default:
      return 0;
  }
});
</script>
<template>
  <q-stepper
    v-if="order?.MasterType === MasterTypeNum.Buy"
    :model-value="stepFormat"
    contracted
    color="blue-13"
    animated
    class="no-shadow q-mb-md"
    bordered
    style="border-bottom-left-radius: 30px; width: 100%"
  >
    <q-step :name="1" prefix="1" title="步驟一" :done="stepFormat > 1">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_1') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_1') }}
      </div>
    </q-step>

    <q-step :name="2" prefix="2" title="步驟二" :done="stepFormat > 2">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_2') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_2') }}
      </div>
    </q-step>

    <q-step :name="3" prefix="3" title="步驟三" :done="stepFormat > 3">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_3') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_3') }}
      </div>
    </q-step>

    <q-step :name="4" prefix="4" title="步驟四" :done="stepFormat > 4">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_4') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_4') }}
      </div>
    </q-step>
  </q-stepper>

  <q-stepper
    v-else
    :model-value="stepFormat"
    contracted
    color="blue-13"
    animated
    class="no-shadow q-mb-md"
    bordered
    style="border-bottom-left-radius: 30px"
  >
    <q-step :name="1" prefix="1" title="步驟一" :done="stepFormat > 1">
      <!-- 步驟title 提交訂單 -->
      <div class="text-h6 text-weight-bold">
        {{ t('buy.step_hint_buy_title_1') }}
      </div>
      <!-- 請填寫訂單資料 -->
      <div class="text-grey-6">
        {{ t('buy.step_hint_buy_text_1') }}
      </div>
    </q-step>

    <q-step :name="2" prefix="2" title="步驟二" :done="stepFormat > 2">
      <div class="text-h6 text-weight-bold">
        {{ t('buy.step_hint_buy_title_2') }}
      </div>
      <div class="text-grey-6">
        {{ t('buy.step_hint_buy_text_2') }}
      </div>
    </q-step>

    <q-step :name="3" prefix="3" title="步驟三" :done="stepFormat > 3">
      <div class="text-h6 text-weight-bold">
        {{ t('buy.step_hint_buy_title_3') }}
      </div>
      <div class="text-grey-6">
        {{ t('buy.step_hint_buy_text_3') }}
      </div>
    </q-step>

    <q-step :name="4" prefix="4" title="步驟四" :done="stepFormat > 4">
      <div class="text-h6 text-weight-bold">
        {{ t('buy.step_hint_buy_title_4') }}
      </div>
      <div class="text-grey-6">
        {{ t('buy.step_hint_buy_text_4') }}
      </div>
    </q-step>
  </q-stepper>
</template>

<style scoped></style>
