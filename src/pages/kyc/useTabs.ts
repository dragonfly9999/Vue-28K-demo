import { Component, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import component from './component';

type TabTypes = 'verifing' | 'approved' | 'failed';

type TabOptions = {
  value: TabTypes;
  label: string;
  component?: Component;
  color: string;
  icon: string;
};
export default () => {
  const statusTab = ref<TabTypes>('approved');

  const { t } = useI18n();
  const statusTabOptions: Array<TabOptions> = [
    {
      value: 'approved',
      label: t('kyc.通過審核'),
      color: 'green',
      icon: 'check_circle',
      component: component.ApprovedPanel
    },
    {
      value: 'verifing',
      label: t('kyc.驗證中'),
      color: 'orange',
      icon: 'search',
      component: component.VerifyingPanle
    },
    {
      value: 'failed',
      label: t('kyc.審核失敗'),
      color: 'red',
      icon: 'cancel',
      component: component.FailedPanel
    }
  ];

  return {
    statusTab,
    statusTabOptions
  };
};
