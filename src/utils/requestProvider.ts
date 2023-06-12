import { useRequest } from 'vue-request';
import { computed } from 'vue';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useStorage } from 'vue3-storage';

type ProviderProps<DATA, Params = unknown> = {
  reqFn: (args: Params) => Promise<VirgilRes<DATA>>;
  isManual: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
  onSuccess?: (args?: VirgilRes<DATA>) => void;
  onAfter?: (args?: Params[]) => void;
  onError?: () => void;
};

export const requestProvider = <DATA, Params = unknown>({
  reqFn,
  isManual,
  config,
  onSuccess,
  onError,
  onAfter
}: ProviderProps<DATA, Params>) => {
  const { t } = useI18n();
  const requestInstance = useRequest(reqFn, {
    ...config,
    onError: (error: AxiosError<VirgilRes<DATA>>) => {
      const useCode = error.response?.data.code;
      if (useCode) {
        Notify.create({
          type: 'negative',
          message: t(`error.${error.response?.data.code}`),
          position: 'top-right',
          timeout: 2000
        });

        switch (useCode.toString()) {
          case '91': {
            const storage = useStorage();
            storage.clearStorageSync();
            window.location.pathname = '/';
          }
        }
      }
      if (onError) onError();
    },
    onSuccess: (res) => {
      if (isManual) {
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
