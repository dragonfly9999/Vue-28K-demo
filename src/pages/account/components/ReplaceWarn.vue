<template>
  <q-dialog :model-value="!!replaceChannel" persistent>
    <q-card class="q-pa-md">
      <div class="text-orange-12 text-center text-h5">
        <q-icon name="report_problem" size="60px" />
        <div class="text-bold">
          {{
            `${$t('account.replaceWarn.1')}【${replaceChannelLabel}】${$t(
              'account.replaceWarn.2'
            )} `
          }}
        </div>
      </div>
      <q-card-actions vertical>
        <q-btn
          unelevated
          class="full-width"
          color="blue-13"
          :label="`${$t(
            'account.replaceConfirm.1'
          )}【${replaceChannelLabel}】${$t('account.replaceConfirm.2')}`"
          @click="
            () => {
              $emit('comfirm');
            }
          "
        />
        <q-btn
          class="full-width"
          color="blue-13"
          outline
          label="取消"
          @click="
            () => {
              $emit('update:replaceChannel', null);
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AccountChannelNum } from '../api/useAccHistory';

const props = defineProps<{ replaceChannel: AccountChannelNum | null }>();
defineEmits(['update:replaceChannel', 'comfirm']);

const replaceChannelLabel = computed(() => {
  if (props.replaceChannel === AccountChannelNum.All) return 'B-All';
  if (props.replaceChannel === AccountChannelNum.K100com) return 'K100U.com';
  if (props.replaceChannel === AccountChannelNum.DEMO) return 'Demo K100';
  if (props.replaceChannel === AccountChannelNum.channel_88U) return '88U.com';
  if (props.replaceChannel === AccountChannelNum.U88) return 'U88.com';
  if (props.replaceChannel === AccountChannelNum.JP88) return 'JP88.com';
  if (props.replaceChannel === AccountChannelNum.U28) return 'U28 Exchange';
  if (props.replaceChannel === AccountChannelNum.V100com) return 'V100U.com';
  if (props.replaceChannel === AccountChannelNum.Fxcoin) return 'Fxcoin.com';
  if (props.replaceChannel === AccountChannelNum.K200U) return 'K200U.uk';
  if (props.replaceChannel === AccountChannelNum.K100Net) return 'K100U.net';
  return '';
});
</script>
<style scoped></style>
