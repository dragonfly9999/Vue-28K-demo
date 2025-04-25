<template>
  <q-card class="my-card">
    <q-card-section> Set success </q-card-section>
    <q-card-section>
      <q-btn color="primary" icon="check" label="backLogin" @click="goLogin" />
    </q-card-section>
    <q-card-section
      ><q-btn
        color="primary"
        icon="check"
        label="reForget"
        @click="remakePass"
      />
    </q-card-section>
    <q-banner class="bg-primary text-white">
      Back Login in {{ timeToLogin }} s...
    </q-banner>
  </q-card>
</template>

<script setup lang="ts">
import { storageHelper } from 'src/utils/foragePkg';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// setup funcs
const router = useRouter();
const props = defineProps<{ addedMail: string }>();
const emit = defineEmits<{
  (e: 'remake'): void;
  (e: 'reLogin'): void;
  (e: 'countdown'): void;
}>();
const timeToLogin = ref(10);

// countdown

onMounted(() => {
  const timer = setInterval(() => {
    timeToLogin.value--;
    if (timeToLogin.value === 0) {
      emit('countdown');
      clearInterval(timer);
      storageHelper<string>('mail_vfy').remove();
      router.push('/auth/login');
    }
  }, 1000);

  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});
const remakePass = () => {
  if (props.addedMail) {
    emit('remake');
    storageHelper<string>('mail_vfy').remove();
  }
};

const goLogin = () => {
  emit('reLogin');
  storageHelper<string>('mail_vfy').remove();
  router.push('/auth/login');
};
</script>

<style scoped></style>
