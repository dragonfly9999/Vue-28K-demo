import { AxiosError } from 'axios';
import hooks from 'src/hooks';
import { computed, ref } from 'vue';
import { Options, Service, useRequest } from 'vue-request';

type CustomProps = {
  noFeedback?: boolean;
  noTempData?: boolean;
  noErrorNotify?: boolean;
};

export const requestProvider = <DATA, Params = unknown>(
  service: Service<VirgilRes<DATA>, [Params]>,
  options: Options<VirgilRes<DATA>, [Params]>,
  customProps?: CustomProps
) => {
  const tempData = ref<DATA>();
  const requestInstance = useRequest<VirgilRes<DATA>, [Params]>(service, {
    ...options,
    onSuccess: (virgilRes, params) => {
      if (!customProps?.noTempData) tempData.value = virgilRes.data;
      if (options.manual && !customProps?.noFeedback)
        hooks.useSuccessNotify('success');
      if (options.onSuccess) options.onSuccess(virgilRes, params);
    },
    onError: (error, params) => {
      const virgilError = error as Error | AxiosError<VirgilRes<null>>;
      const useCode =
        'response' in virgilError ? virgilError.response?.data.code : undefined;
      if (
        useCode !== undefined &&
        !customProps?.noErrorNotify &&
        options.manual
      ) {
        hooks.useErrNotify(`Error in ${useCode}`);
      }
      if (useCode?.toString() === '91')
        Object.values(hooks.useKickOut).forEach((kickStep) => kickStep());
      if (useCode?.toString() === '409')
        hooks.useErrNotify('This email has not been verified!!');
      if (options.onError) options.onError(virgilError, params);
    },
  });
  const useData = computed(() => requestInstance.data.value?.data);
  return { ...requestInstance, data: useData, tempData };
};
