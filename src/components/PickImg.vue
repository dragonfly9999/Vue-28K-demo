<template>
  <div>
    <q-file
      outlined
      :rules="[
        (val) => !!val || pickTimes < 1 || $t('error.input.empty'),
        () => !isUploadError || $t('error.圖片上傳失敗'),
      ]"
      v-model="file"
      :label="label"
      use-chips
      accept="image/*"
      ref="picker"
      @update:model-value="handleUpdate"
      :loading="loading"
      @clear="
        () => {
          isUploadError = false;
          $emit('update:base64', '');
        }
      "
    >
      <template v-slot:append>
        <q-btn round flat icon="add" @click="() => picker.pickFiles()" />
      </template>
    </q-file>
    <div>base64: {{ base64 }}</div>
    <div>loading: {{ loading }}</div>
  </div>
</template>

<script setup lang="ts">
import { handleBoforeUpload } from 'src/utils/ImageManager';
import { ref } from 'vue';
defineProps<{ base64: string; label: string }>();
const emits = defineEmits(['update:base64', 'uploading', 'onload']);

const pickTimes = ref(0);
const file = ref();
const isUploadError = ref(false);
const loading = ref(false);
const handleUpdate = (file: File) => {
  pickTimes.value += 1;
  loading.value = true;
  isUploadError.value = false;
  emits('uploading');
  handleBoforeUpload(file)
    .then((base64) => {
      emits('update:base64', base64);
    })
    .catch(() => {
      isUploadError.value = true;
    })
    .finally(() => {
      loading.value = false;
      emits('onload');
    });
};

//
defineExpose({
  file,
  loading,
});
const picker = ref();
</script>
<style scoped></style>
