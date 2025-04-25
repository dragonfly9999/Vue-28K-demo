<template>
  <q-dialog v-model="show">
    <q-card style="min-width: 80vw; min-height: 90vh">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">{{ title }}</div>
        <q-btn flat dense icon="close" @click="close" />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none">
        <iframe
          :src="content"
          width="100%"
          height="100%"
          style="min-height: 80vh; border: none"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

// props
const props = defineProps<{
  showPdf: boolean;
  content: string;
  title?: string;
}>();

const emit = defineEmits(['update:showPdf']);

const show = ref(props.showPdf);

watch(
  () => props.showPdf,
  (val) => {
    show.value = val;
  }
);
watch(show, (val) => {
  emit('update:showPdf', val);
});

const close = () => {
  show.value = false;
  emit('update:showPdf', false);
};
</script>

<style scoped></style>
