import { Options, Service, useRequest } from 'vue-request';
import { computed, ref } from 'vue';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import hooks from 'src/hooks';

type CustomProps = {
  noFeedback?: boolean;
  noTempData?: boolean;
  noErrorNotify?: boolean;
}

export const requestProvider = <DATA, Params = unknown>(
  service: Service<VirgilRes<DATA>, [Params]>,
  options: Options<VirgilRes<DATA>, [Params]>,
  customProps?: CustomProps,
) => {
  const { t } = useI18n();
  const tempData = ref<DATA>();
  const requestInstance = useRequest<VirgilRes<DATA>, [Params]>(service, {
    ...options,
    onSuccess: (virgilRes, params) => {
      if (!customProps?.noTempData) tempData.value = virgilRes.data;
      if(options.manual && !customProps?.noFeedback) hooks.useSuccessNotify( t('success'))
      if (options.onSuccess) options.onSuccess(virgilRes, params);
    },
    onError: (error, params) => {
      const virgilError = error as Error | AxiosError<VirgilRes<null>>;
      const useCode = 'response' in virgilError ? virgilError.response?.data.code : undefined;
      if (useCode !== undefined && !customProps?.noErrorNotify && options.manual) {
        hooks.useErrorNotify(t(`error.api.${useCode}`))
      }
      if(useCode?.toString() === '91') Object.values(hooks.useKickOut).forEach((kickStep) => kickStep())
      if (options.onError) options.onError(virgilError, params);
    },
  });
  const useData = computed(() => requestInstance.data.value?.data);
  return { ...requestInstance, data: useData, tempData };
};

