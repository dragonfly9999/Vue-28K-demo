<template>
  <q-card class="q-pa-md myshadow">
    <q-form>
      <q-card-section class="text-subtitle1">
        <q-avatar
          icon="edit_road"
          size="sm"
          color="blue-13"
          text-color="white"
          class="q-mr-md"
        />
        {{ $t('account.設定通道') }}
      </q-card-section>
      <div
        class="q-pa-sm"
        v-for="(
          allowAccountOption, storeIndex
        ) in accountStore.allowChannelsOption"
        :key="storeIndex"
      >
        <q-select
          :loading="loading"
          stack-label
          filled
          color="blue-13"
          standout="bg-blue-13 text-white"
          :label="allowAccountOption.label"
          v-model="channels[allowAccountOption.value]"
          :options="handleAccOption(channels[allowAccountOption.value]?.acc_ID)"
          @update:model-value="
            (newOption) =>
              handleUpdateChannel(allowAccountOption.value, newOption)
          "
        />
      </div>
    </q-form>

    <!-- 帳號使用中，是否取代 -->
    <ReplaceWarn
      v-model:replace-channel="replaceChannel.originChannel"
      @update:replace-channel="handleUpdateReplaceChannel"
      @comfirm="handleConfirmReplace"
    />
  </q-card>
</template>

<script setup lang="ts">
import ReplaceWarn from './ReplaceWarn.vue';
import { reactive, watch } from 'vue';
import { type AccRes, AccountChannelNum } from '../api/useAccHistory';
import { AccNum, useSetAcc } from '../api';
import { useAccountStore } from 'src/stores';

const props = defineProps<{
  accs: Array<AccRes> | undefined;
  showAccs: Array<AccRes> | undefined;
}>();
const emits = defineEmits(['refresh']);
const accountStore = useAccountStore();
// state
const channels = reactive<{
  [key in AccountChannelNum]: { acc_ID: number; label: string } | null;
}>({
  // { [頻道]: { value: 帳戶ID, label: '' } }
  [AccountChannelNum.All]: null,
  [AccountChannelNum.K100com]: null,
  [AccountChannelNum.DEMO]: null,
  [AccountChannelNum.channel_88U]: null,
  [AccountChannelNum.U88]: null,
  [AccountChannelNum.JP88]: null,
  [AccountChannelNum.U28]: null,
  [AccountChannelNum.V100com]: null,
  [AccountChannelNum.Fxcoin]: null,
  [AccountChannelNum.K200U]: null,
  [AccountChannelNum.K100Net]: null,
});
const replaceChannel = reactive<{
  originChannel: AccountChannelNum | null;
  newChannel: AccountChannelNum | null;
  accountID: number | null;
}>({
  originChannel: null,
  newChannel: null,
  accountID: null,
});
// mutate
const { run: set, loading } = useSetAcc({
  onSuccess: () => {
    emits('refresh');
  },
});

// handler
const handleAccOption = (
  currentH_id: number | undefined | null
): Array<{ value: number; label: string }> | undefined => {
  const pureH_ids = props.showAccs
    ?.map((mapAcc) => mapAcc.H_id)
    .filter((filterID) => filterID !== currentH_id);
  const accountOptions = pureH_ids?.map((mapID) => {
    const mapAcc = props.showAccs?.find((findAcc) => findAcc.H_id === mapID);
    return {
      value: mapID,
      label: ` ${mapAcc?.[AccNum.Name]} | ${mapAcc?.[AccNum.Account]}
      | ${mapAcc?.[AccNum.BankID]} | ${mapAcc?.[AccNum.Branch]} `,
    };
  });
  return accountOptions;
};

const handleUpdateChannel = (
  currentChannel: AccountChannelNum,
  newOption: { value: number; label: string }
) => {
  const setAcc = props.accs?.find(
    (findAcc) => findAcc.H_id === newOption.value
  );
  if (!setAcc) return;
  set({
    [AccNum.Name]: setAcc[AccNum.Name],
    [AccNum.Account]: setAcc[AccNum.Account],
    [AccNum.BankID]: setAcc[AccNum.BankID],
    [AccNum.Branch]: setAcc[AccNum.Branch],
    [AccNum.Channel]: currentChannel,
  });
};

const handleUpdateReplaceChannel = (newChannel: AccountChannelNum | null) => {
  if (!newChannel) {
    if (replaceChannel.newChannel) channels[replaceChannel.newChannel] = null;
    Object.entries(replaceChannel).forEach(
      ([forKey]) =>
        (replaceChannel[forKey as keyof typeof replaceChannel] = null)
    );
  }
};

const handleConfirmReplace = () => {
  if (
    replaceChannel.newChannel === null ||
    replaceChannel.accountID === null ||
    replaceChannel.originChannel === null
  )
    return;
  const setAcc = props.accs?.find(
    (findAcc) => findAcc.H_id === replaceChannel.accountID
  );
  if (!setAcc) return;
  set({
    [AccNum.Channel]: replaceChannel.newChannel,
    [AccNum.Name]: setAcc[AccNum.Name],
    [AccNum.Account]: setAcc[AccNum.Account],
    [AccNum.BankID]: setAcc[AccNum.BankID],
    [AccNum.Branch]: setAcc[AccNum.Branch],
  });
  Object.entries(replaceChannel).forEach(
    ([forKey]) => (replaceChannel[forKey as keyof typeof replaceChannel] = null)
  );
};

// life cycle
watch(
  () => props.accs,
  (newValue) => {
    if (newValue == undefined) return;
    // reset
    Object.entries(channels).forEach(([forKey]) => {
      channels[Number(forKey) as keyof typeof channels] = null;
    });
    newValue.forEach((forAcc) => {
      if (forAcc[AccNum.Channel] == null) return;
      channels[Number(forAcc[AccNum.Channel]) as AccountChannelNum] = {
        acc_ID: forAcc.H_id,
        label: ` ${forAcc?.[AccNum.Name]} | ${forAcc?.[AccNum.Account]}
      | ${forAcc?.[AccNum.BankID]} | ${forAcc?.[AccNum.Branch]} `,
      };
    });
  },
  {
    immediate: true,
  }
);
</script>
<style scoped></style>
