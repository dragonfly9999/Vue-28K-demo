import { defineStore } from 'pinia';
import use2fa from 'src/layouts/api/use2fa';
import { toRefs, computed } from 'vue'

export const use2faStore = defineStore('2fa', () => {
  const twoFaRequest = use2fa({})
  const { data } = toRefs(twoFaRequest);
  const isEnabled = computed(() => !!data.value?.otpkey);
const qrSrc = computed(() => `data:image/png;base64,${data.value?.Qr_img}`);

return {
    ...twoFaRequest,
    isEnabled,
    qrSrc,
  }
})
