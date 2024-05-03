<template>
  <q-card class="q-pa-md q-ma-sm" flat bordered>
    <!-- 編輯帳戶 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('account.銀行戶名') }}
      </div>
      <div class="flex items-center justify-end cursor-pointer">
        {{ accInfo[AccNum.Name] }}
        <q-popup-edit
          :disable="loading"
          v-model="editFields[AccNum.Name]"
          v-slot="scope"
          touch-position
          persistent
          buttons
          @save="
            (value, initValue) => {
              if (value !== initValue) {
                $emit('edit', { field: AccNum.Name, value, id: accInfo.H_id });
              }
            }
          "
          :label-set="$t('main.confirm')"
          :label-cancel="$t('transaction.cancel')"
        >
          <q-input
            :loading="loading"
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="() => scope.set()"
          />
        </q-popup-edit>
        <q-icon flat round name="edit" color="blue-13" class="q-ml-xs" />
      </div>
      <div style="border: 0.25px dashed #eeeeee"></div>
    </div>

    <!-- 編輯帳號 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('account.銀行帳號') }}
      </div>
      <div class="flex items-center justify-end cursor-pointer">
        {{ accInfo[AccNum.Account] }}
        <q-popup-edit
          v-model="editFields[AccNum.Account]"
          v-slot="scope"
          touch-position
          persistent
          buttons
          :disable="loading"
          @save="
            (value, initValue) => {
              if (value !== initValue) {
                $emit('edit', {
                  field: AccNum.Account,
                  value,
                  id: accInfo.H_id,
                });
              }
            }
          "
          :label-set="$t('main.confirm')"
          :label-cancel="$t('transaction.cancel')"
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="() => scope.set()"
          />
        </q-popup-edit>
        <q-icon flat round name="edit" color="blue-13" class="q-ml-xs" />
      </div>
      <div style="border: 0.25px dashed #eeeeee"></div>
    </div>

    <!-- 銀行名稱 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('account.銀行名稱') }}
      </div>
      <div class="flex items-center justify-end cursor-pointer">
        {{ accInfo[AccNum.BankID] }}
        <q-popup-edit
          v-model="editFields[AccNum.BankID]"
          v-slot="scope"
          touch-position
          persistent
          buttons
          :disable="loading"
          @save="
            (value, initValue) => {
              if (value !== initValue) {
                $emit('edit', {
                  field: AccNum.BankID,
                  value,
                  id: accInfo.H_id,
                });
              }
            }
          "
          :label-set="$t('main.confirm')"
          :label-cancel="$t('transaction.cancel')"
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="() => scope.set()"
          />
        </q-popup-edit>
        <q-icon flat round name="edit" color="blue-13" class="q-ml-xs" />
      </div>
      <div style="border: 0.25px dashed #eeeeee"></div>
    </div>

    <!-- 所在省市 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('account.所在省市') }}
      </div>
      <div class="flex items-center justify-end cursor-pointer">
        {{ accInfo[AccNum.Branch] }}
        <q-popup-edit
          v-model="editFields[AccNum.Branch]"
          v-slot="scope"
          touch-position
          persistent
          buttons
          :disable="loading"
          @save="
            (value, initValue) => {
              if (value !== initValue) {
                $emit('edit', {
                  field: AccNum.Branch,
                  value,
                  id: accInfo.H_id,
                });
              }
            }
          "
          :label-set="$t('main.confirm')"
          :label-cancel="$t('transaction.cancel')"
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="() => scope.set()"
          />
        </q-popup-edit>
        <q-icon flat round name="edit" color="blue-13" class="q-ml-xs" />
      </div>
      <div style="border: 0.25px dashed #eeeeee"></div>
    </div>

    <!-- 使用通路 -->
    <!-- <div>
      <div class="text-grey-6 text-caption">
        {{ $t('account.頻道') }}
      </div>
      <div class="flex items-center justify-end cursor-pointer">
        {{ channelLabel }}
        <q-popup-edit
          v-model="editFields[AccNum.Channel]"
          v-slot="scope"
          touch-position
          persistent
          buttons
          @save="
            (value, initValue) => {
              if (value !== initValue) {
                // 原本就存在通路時Server會自動覆蓋原本的帳號
                if (initValue !== null) {
                  isWait = true;
                  del({
                    H_id: props.accInfo.H_id,
                  });
                }
                set({
                  ...editFields,
                  [AccNum.Channel]: value.value,
                });
              }
            }
          "
          :label-set="$t('main.confirm')"
          :label-cancel="$t('transaction.cancel')"
        >
          <q-select
            @keyup.enter="() => scope.set()"
            v-model="scope.value"
            outlined
            :label="$t('account.請設定通道')"
            :options="[
              { label: 'B-All', value: -1 },
              // { label: 'BVAC', value: 0 },
              // { label: 'Demo K100U', value: 1 },
              // { label: '88U', value: 2 },
              // { label: 'U88', value: 3 },
              // { label: 'JP88', value: 4 },
              { label: 'K100U com', value: 5 },
              // { label: 'U28 Exchange', value: 6 },
              // { label: 'V100U com', value: 7 },
              // { label: 'Fxcoin', value: 9 },
              // { label: 'K200U', value: 10 },
              // { label: 'K100 net', value: 11 },
            ]"
          >
          </q-select>
        </q-popup-edit>
        <q-icon flat round name="edit" color="blue-13" class="q-ml-xs" />
      </div>
      <div style="border: 0.25px dashed #eeeeee"></div>
    </div> -->

    <q-card-actions
      align="right"
      class="q-gutter-x-sm"
      style="padding: 0; margin-top: 15px"
    >
      <!-- 設為預設帳戶 btn -->
      <!-- if帳戶數量=0，新增第一個帳戶後，自動設為預設 -->
      <!-- 變成預設帳戶後，點亮這顆星  -->
      <!-- 變成預設帳戶後，disable不可點擊 -->
      <!-- <q-checkbox
        :model-value="isCurrentAcc"
        checked-icon="star"
        unchecked-icon="star_border"
        color="orange"
        @click="
          () => {
            set({
              ...editFields,
              [AccNum.Channel]: accInfo[AccNum.Channel],
            });
          }
        "
      >
        <q-tooltip>
          {{ $t('label.preset_hint2') }}
        </q-tooltip>
      </q-checkbox> -->

      <!-- 刪除帳戶 btn-->
      <!-- 變成預設帳戶後，disable不可點擊 -->
      <q-btn
        @click="() => $emit('update:delID', accInfo.H_id)"
        flat
        round
        color="blue-13"
        icon="delete"
        :loading="loading"
      >
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue';
import { AccNum, type AccRes } from '../api/useAccHistory';

const props = defineProps<{
  accInfo: AccRes;
  currentAcc: Omit<AccRes, 'H_id'> | undefined;
  loading?: boolean;
}>();
defineEmits(['update:delID', 'edit']);

const editFields = reactive<
  Omit<AccRes, 'H_id' | AccNum.Channel> & {
    [AccNum.Channel]: { label: string; value: number } | null;
  }
>({
  [AccNum.Name]: '',
  [AccNum.Account]: '',
  [AccNum.BankID]: '',
  [AccNum.Branch]: '',
  [AccNum.Channel]: null,
});

// const channelLabel = computed(() => {
//   if (props.accInfo[AccNum.Channel] === null) return t('account.未設定頻道');
//   if (props.accInfo[AccNum.Channel] === -1) return 'B-All';
//   if (props.accInfo[AccNum.Channel] === 0) return 'BVAC';
//   if (props.accInfo[AccNum.Channel] === 1) return 'Demo K100U';
//   if (props.accInfo[AccNum.Channel] === 2) return '88U';
//   if (props.accInfo[AccNum.Channel] === 3) return 'U88';
//   if (props.accInfo[AccNum.Channel] === 4) return 'JP88';
//   if (props.accInfo[AccNum.Channel] === 5) return 'K100U com';
//   if (props.accInfo[AccNum.Channel] === 6) return 'U28 Exchange';
//   if (props.accInfo[AccNum.Channel] === 7) return 'V100U com';
//   if (props.accInfo[AccNum.Channel] === 9) return 'Fxcoin';
//   if (props.accInfo[AccNum.Channel] === 10) return 'K200U';
//   if (props.accInfo[AccNum.Channel] === 11) return 'K100 net';
//   return props.accInfo[AccNum.Channel];
// });
// const isCurrentAcc = computed(() => {
//   if (!props.currentAcc) return false;
//   return (
//     props.accInfo[AccNum.Name] === props.currentAcc[AccNum.Name] &&
//     props.accInfo[AccNum.Account] === props.currentAcc[AccNum.Account] &&
//     props.accInfo[AccNum.BankID] === props.currentAcc[AccNum.BankID] &&
//     props.accInfo[AccNum.Branch] === props.currentAcc[AccNum.Branch]
//   );
// });

watch(
  () => props.accInfo?.H_id,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      editFields[AccNum.Name] = props.accInfo[AccNum.Name];
      editFields[AccNum.Account] = props.accInfo[AccNum.Account];
      editFields[AccNum.BankID] = props.accInfo[AccNum.BankID];
      editFields[AccNum.Branch] = props.accInfo[AccNum.Branch];
      editFields[AccNum.Channel] =
        [
          { label: 'All', value: -1 },
          { label: 'BVAC', value: 0 },
          { label: 'Demo K100U', value: 1 },
          // { label: '88U', value: 2 },
          // { label: 'U88', value: 3 },
          // { label: 'JP88', value: 4 },
          { label: 'K100U com', value: 5 },
          // { label: 'U28 Exchange', value: 6 },
          // { label: 'V100U com', value: 7 },
          // { label: 'Fxcoin', value: 9 },
          // { label: 'K200U', value: 10 },
          // { label: 'K100 net', value: 11 },
        ].find((option) => option.value === props.accInfo[AccNum.Channel]) ??
        null;
    }
  },
  {
    immediate: true,
  }
);
</script>
<style scoped></style>
