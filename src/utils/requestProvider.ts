import { useRequest } from 'vue-request';
import { computed } from 'vue';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useStorage } from 'vue3-storage';
import { axiosProvider } from './axiosProvider';

type ProviderProps<DATA, Params = unknown> = {
  reqFn: (args: Params) => Promise<VirgilRes<DATA>>;
  isManual: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
  onSuccess?: (args?: VirgilRes<DATA>) => void;
  onAfter?: (args?: Params[]) => void;
  onError?: () => void;
  noFeedback?: boolean;
};

export const requestProvider = <DATA, Params = unknown>({
  reqFn,
  isManual,
  config,
  onSuccess,
  onError,
  onAfter,
  noFeedback
}: ProviderProps<DATA, Params>) => {
  const { t } = useI18n();
  const requestInstance = useRequest(reqFn, {
    ...config,
    onError: (error: AxiosError<VirgilRes<DATA>>) => {
      const useCode = error.response?.data.code;
      if (useCode) {
        Notify.create({
          type: 'negative',
          message: t(`error.api.${error.response?.data.code}`),
          position: 'top-right',
          timeout: 2000
        });

        switch (useCode.toString()) {
          case '91': {
            // 強制登出，流程跟登出一樣，但使用ts的寫法。
            axiosProvider.post('/Req_AutoPick.aspx', {
              mode: 0
            });
            setTimeout(() => {
              useStorage().clearStorageSync();
              window.location.pathname = '/';
            }, 100);
          }
        }
      }
      if (onError) onError();
    },
    onSuccess: (res) => {
      if (isManual && !noFeedback) {
        Notify.create({
          type: 'positive',
          message: t('success'),
          position: 'top-right',
          timeout: 500
        });
      }
      if (onSuccess) onSuccess(res);
    },
    onAfter: (params) => {
      !!onAfter && onAfter(params);
    },
    manual: isManual
  });
  const useData = computed(() => requestInstance.data.value?.data);
  return { ...requestInstance, data: useData };
};
