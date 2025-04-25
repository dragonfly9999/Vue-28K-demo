<template>
  <div class="flex justify-center items-center">Forget Page Basic</div>
  <AddMailFormStep v-if="!addedMail && !token" @mail-added="addDone" />
  <SendCodeFormStep v-if="addedMail && !token" @tokenGot="token = $event" />
  <NewPwFormStep v-if="addedMail && token" :token="token" />
</template>

<script setup lang="ts">
import { storageHelper } from 'src/utils/foragePkg';
import { onMounted, ref } from 'vue';
import SendCodeFormStep from './components/SendCodeFormStep.vue';
import AddMailFormStep from './components/AddMailFormStep.vue';
import NewPwFormStep from './components/NewPwFormStep.vue';

// setup funcs
const token = ref<string | null>(null);
const addedMail = ref<string | null>(null);
const isCheckCode = ref<boolean | null>(false);
onMounted(() => {
  addedMail.value = storageHelper<string | null>('mail_vfy').getItem();
  isCheckCode.value = storageHelper<boolean>('isCodeChecked').getItem();
});

const addDone = () => {
  addedMail.value = storageHelper<string | null>('mail_vfy').getItem();
};
</script>

<style scoped></style>
