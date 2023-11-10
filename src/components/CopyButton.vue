<script setup lang="ts">
import { copyToClipboard } from 'quasar';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
const props = defineProps<{ value?: string }>();
const quasar = useQuasar();

const isCopy = ref(false);
const handleClick = () => {
  if (props.value)
    copyToClipboard(props.value)
      .then(() => {
        isCopy.value = true;
        quasar.notify({
          color: 'positive',
          message: 'Copy'
        });
      })
      .catch(() => {
        quasar.notify({
          color: 'negative',
          message: '複製失敗'
        });
      });
  setTimeout(() => (isCopy.value = false), 500);
};
const getIcon = computed(() =>
  isCopy.value ? 'check_circle_outline' : 'content_copy'
);
</script>

<template>
  <q-btn
    flat
    color="blue-13"
    dense
    :icon="getIcon"
    :disable="isCopy"
    size="sm"
    @click="handleClick()"
  />
</template>

<style scoped></style>
