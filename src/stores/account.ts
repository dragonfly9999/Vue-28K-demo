import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { AccountChannelNum } from 'src/pages/account/api/useAccHistory';

export const channelOptions: Array<{
  label: string;
  value: AccountChannelNum;
}> = [
  { label: 'B-All', value: -1 },
  // { label: 'BVAC', value: 0 },
  { label: 'Demo K100U', value: 1 },
  { label: '88U', value: 2 },
  { label: 'U88', value: 3 },
  { label: 'JP88', value: 4 },
  { label: 'K100U com', value: 5 },
  { label: 'U28 Exchange', value: 6 },
  { label: 'V100U com', value: 7 },
  { label: 'Fxcoin', value: 9 },
  { label: 'K200U', value: 10 },
  { label: 'K100 net', value: 11 }
];

export const useAccountStore = defineStore('account', () => {
  const allowChannels = ref<Array<number>>([]);
  const allowChannelsOption = computed(() => {
    return channelOptions.filter(
      (option) =>
        allowChannels.value.includes(option.value) || option.value === -1
    );
  });

  return {
    allowChannels,
    allowChannelsOption
  };
});
