<template>
  <q-dialog :model-value="visible" persistent>
    <q-card
      class="q-pa-lg"
      align="center"
      style="width: 360px"
      @click="() => (countDownTime = 0)"
    >
      <q-icon name="check_circle" color="green-8" size="lg" />
      <!-- 提交成功 -->
      <div class="text-h6 text-weight-bold">{{ $t('kyc.提交成功') }}</div>
      <div class="flex justify-center q-gutter-x-sm q-mt-lg text-grey-5">
        <!-- 等待跳轉 -->
        <div>{{ $t('kyc.等待跳轉') }}</div>
        <q-spinner-dots size="1.5em" />
        <div>{{ countDownTime }}</div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ visible: boolean }>();
const emits = defineEmits(['close']);
const router = useRouter();
// DOM
const countDownTime = ref(0);
const countInterval = ref<NodeJS.Timeout>();

watchEffect(() => {
  if (props.visible) {
    countDownTime.value = 5;
    countInterval.value = setInterval(() => {
      if (countDownTime.value > 0) { // 倒數
        countDownTime.value -= 1;
      } else { // 跳轉
        clearInterval(countInterval.value);
        emits('close');
        router.push({ name: 'kyc' });
      }
    }, 1000);
  }
});
</script>
<style scoped></style>
