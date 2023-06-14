<script setup lang="ts">
import RecordItem from 'src/components/RecordItem.vue';
import { MasterTypeNum } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
defineProps<{
  orders: Array<OrderRecord | ExpiredOrder> | undefined;
  loading: boolean;
  type: MasterTypeNum | 5;
}>();
const emit = defineEmits(['update:type']);

const tab = ref(5);
const allType = computed(() => [
  {
    value: 5,
    label: '全部',
    color: 'text-dark'
  },
  {
    value: MasterTypeNum.Buy,
    label: '購買',
    color: 'text-blue-13'
  },
  {
    value: MasterTypeNum.Sell,
    label: '出售',

    color: 'text-red'
  },
  {
    value: MasterTypeNum.TransIn,
    label: '轉入',
    color: 'text-purple-7'
  },
  {
    value: MasterTypeNum.TransOut,
    label: '轉出',
    color: 'text-purple-7'
  }
]);
</script>
<template>
  <div class="no-margin no-padding">
    <q-tabs
      :model-value="type"
      @update:model-value="(value) => emit('update:type', value)"
      align="justify"
      inline-label
      class="bg-grey-1 text-grey q-mt-sm"
      :breakpoint="0"
    >
      <q-tab
        v-for="(type, index) in allType"
        :key="index"
        :class="type.color"
        :name="type.value"
        :label="$t(`transaction_history.label.transaction_type.${type.value}`)"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <!-- 全部 -->
      <q-tab-panel
        v-for="(type, index) in allType"
        :name="type.value"
        :key="index"
      >
        <!-- 載入API -->
        <q-spinner-tail size="2em" color="blue-13" v-if="loading && !orders" />
        <div v-else>
          <div v-for="(order, index) in orders" :key="index">
            <RecordItem :order="order" />
            <q-separator class="q-mt-sm" />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped></style>
