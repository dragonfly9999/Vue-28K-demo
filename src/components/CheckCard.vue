<script setup lang="ts">
defineProps<{ visible: boolean; message: string }>();
const emit = defineEmits(['confirm', 'close']);
</script>
<template>
  <q-dialog :model-value="visible">
    <q-card class="q-pa-md">
      <!--  -->
      <p>
        {{ message }}
      </p>

      <!--  -->
      <q-card-actions align="right">
        <q-btn unelevated color="blue-13" @click="() => emit('confirm')">
          {{ $t('label.confirm') }}
        </q-btn>

        <q-btn outline color="blue-13" @click="() => emit('close')">
          {{ $t('label.back') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
