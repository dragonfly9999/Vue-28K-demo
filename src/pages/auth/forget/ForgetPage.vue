<template>
  <div class="flex justify-center items-center">Forget Page Basic</div>
  <AddMailFormStep
    v-if="(!addedMail && !token) || (!addedMail && !token && backMail)"
    @mail-added="addDone"
    :letFillMail="backMail"
  />
  <SendCodeFormStep
    v-if="addedMail && !token && !backMail"
    @tokenGot="token = $event"
    @currMail="resetMail"
  />
  <NewPwFormStep
    v-if="addedMail && token && !nfyShow"
    :token="token"
    @show-notify="showNotify"
  />

  <PwDoneModal
    v-if="addedMail && token && nfyShow"
    :addedMail="addedMail"
    @remake="resetAll"
    @reLogin="resetAll"
    @countdown="resetAll"
  />
</template>

<script setup lang="ts">
import { storageHelper } from 'src/utils/foragePkg';
import { onMounted, ref } from 'vue';
import SendCodeFormStep from './components/SendCodeFormStep.vue';
import AddMailFormStep from './components/AddMailFormStep.vue';
import NewPwFormStep from './components/NewPwFormStep.vue';
import PwDoneModal from './components/PwDoneModal.vue';

// setup funcs
const token = ref<string | null>(null);
const addedMail = ref<string | null>(null);
const isCheckCode = ref<boolean | null>(false);
const backMail = ref<string | null>(null);
const nfyShow = ref<boolean>(false);

onMounted(() => {
  addedMail.value = storageHelper<string | null>('mail_vfy').getItem();
  isCheckCode.value = storageHelper<boolean>('isCodeChecked').getItem();
});

const addDone = () => {
  addedMail.value = storageHelper<string | null>('mail_vfy').getItem();
  backMail.value = null;
};
const resetMail = (usedMail: string | null) => {
  backMail.value = usedMail;
  addedMail.value = null;
  token.value = null;
};

const resetAll = () => {
  backMail.value = null;
  addedMail.value = null;
  token.value = null;
  nfyShow.value = false;
};

const showNotify = () => {
  nfyShow.value = true;
};
</script>

<style scoped></style>
