<template>
  <q-dialog
    :model-value="visible"
    @update:model-value="
      (newVisible) => {
        $emit('update:visible', newVisible);
      }
    "
    persistent
  >
    <q-card bordered>
      <q-card-section class="full-width">
        <div class="text-h6 q-mb-md">
          {{ $t('main.是否開啟提示音') }}
        </div>
        <div class="flex justify-end">
          <q-btn
            @click="
              () => {
                thirdStore.hint = true;
                $emit('update:visible', false);
              }
            "
            class="q-mx-sm"
            color="primary"
            outline
          >
            {{ $t('main.是') }}
          </q-btn>
          <q-btn outline @click="() => $emit('update:visible', false)">
            {{ $t('main.否') }}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useThirdStore } from 'src/stores';

defineProps<{ visible: boolean }>();
defineEmits(['update:visible']);

//
const thirdStore = useThirdStore();
</script>
<style scoped></style>
