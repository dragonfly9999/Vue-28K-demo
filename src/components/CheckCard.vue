<template>
  <q-dialog :model-value="visible">
    <q-card class="q-pa-md">
      <!--  -->
      <p>
        {{ message }}
      </p>

      <!--  -->
      <q-card-actions align="right">
        <q-btn
          :loading="loading"
          unelevated
          color="blue-13"
          @click="() => emit('confirm')"
        >
          {{ $t('main.confirm') }}
        </q-btn>

        <q-btn
          :loading="loading"
          outline
          color="blue-13"
          @click="() => emit('close')"
        >
          {{ $t('main.back') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; message: string; loading?: boolean }>();
const emit = defineEmits(['confirm', 'close']);
</script>

<style scoped></style>
