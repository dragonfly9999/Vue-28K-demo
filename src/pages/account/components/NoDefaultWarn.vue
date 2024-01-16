<template>
  <!-- 沒有預設帳號 -->
  <q-dialog
    :model-value="visible"
    @update:model-value="(newVisible) => $emit('update:visible', newVisible)"
  >
    <q-card
      class="q-pa-md"
      @click="
        () => {
          $emit('update:visible', false);
        }
      "
    >
      <div class="flex text-orange-12 items-center text-h5">
        <q-icon class="material-icons-outlined q-mr-md" name="report_problem" />
        <div class="text-bold">
          {{ $t('account.未設定預設帳號') }}
        </div>
      </div>
      <div class="text-body1">
        ({{ $t('account.設定一個帳號的頻道為全部') }})
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>();
defineEmits(['update:visible']);
</script>

<style scoped></style>
