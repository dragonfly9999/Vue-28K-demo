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

      <div class="q-pa-sm">
        <q-select
          :loading="loading"
          stack-label
          filled
          color="blue-13"
          standout="bg-blue-13 text-white"
          :label="$t('account.全部通道')"
          v-model="channels[AccountChannelNum.All]"
          :options="handleAccOption(channels[AccountChannelNum.All]?.value)"
          @update:model-value="
            (newOption) => handleIsReplace(AccountChannelNum.All, newOption)
          "
        />
      </div>
      <div class="q-pa-sm">
        <q-select
          :loading="loading"
          stack-label
          filled
          color="blue-13"
          standout="bg-blue-13 text-white"
          label="K100U.com"
          v-model="channels[AccountChannelNum.K100com]"
          :options="handleAccOption(channels[AccountChannelNum.K100com]?.value)"
          @update:model-value="
            (newOption) => handleIsReplace(AccountChannelNum.K100com, newOption)
          "
        />
      </div>
      <div class="q-pa-sm">
        <q-select
          :loading="loading"
          stack-label
          filled
          color="blue-13"
          standout="bg-blue-13 text-white"
          label="K200U.uk"
          v-model="channels[AccountChannelNum.K200U]"
          :options="handleAccOption(channels[AccountChannelNum.K200U]?.value)"
          @update:model-value="
            (newOption) => handleIsReplace(AccountChannelNum.K200U, newOption)
          "
        />
      </div>
      <div class="q-pa-sm">
        <q-select
          :loading="loading"
          stack-label
          filled
          color="blue-13"
          standout="bg-blue-13 text-white"
          label="K100U.net"
          v-model="channels[AccountChannelNum.K100Net]"
          :options="handleAccOption(channels[AccountChannelNum.K100Net]?.value)"
          @update:model-value="
            (newOption) => handleIsReplace(AccountChannelNum.K100Net, newOption)
          "
        />
      </div>
      <!-- <q-card-actions align="right">
        <q-btn
          unelevated
          disable
          color="blue-13"
          :label="$t('account.儲存')"
          padding="5px 20px"
          type="submit"
        />
      </q-card-actions> -->
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
import { AccRes, AccountChannelNum } from '../api/useAccHistory';
import { AccNum, useSetAcc } from '../api';

const props = defineProps<{
  accs: Array<AccRes> | undefined;
  showAccs: Array<AccRes> | undefined;
}>();
const emits = defineEmits(['refresh']);
// state
const channels = reactive<{
  [key in AccountChannelNum]: { value: number; label: string } | null;
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
const handleAccOption = (currentH_id: number | undefined | null) => {
  // [{ value: 帳戶ID, label: '' }]
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

const handleIsReplace = (
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
  // const originChannel = Object.entries(channels)
  //   .filter(([key]) => Number(key) !== currentChannel)
  //   .find(([_, option]) => option?.value === newOption.value);
  // if (!originChannel) return;
  // const originKey = Number(originChannel[0]) as AccountChannelNum;
  // if (!(originKey in channels)) return;
  // replaceChannel.accountID = newOption.value;
  // replaceChannel.newChannel = currentChannel;
  // replaceChannel.originChannel = originKey;
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
        value: forAcc.H_id,
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
