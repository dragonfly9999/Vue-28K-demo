<template>
  <div class="login_container">
    <q-form @submit="handleSubmit">
      <div class="text-start" style="font-weight: 400; font-size: 16px">
        <p
          style="
            font-weight: 700;
            font-size: 33px;
            line-height: 30%;
            letter-spacing: 0%;
          "
        >
          {{ t('login') }}
        </p>

        <div>
          <q-img
            :src="SecLogoLogin"
            alt="sec_logo"
            style="width: 22px; height: 22px; margin-right: 4px"
          />
          <span>
            {{ t('sec_confirm') }}
          </span>
        </div>
      </div>
      <div>
        <div class="col">
          <div class="input-label">{{ t('email') }}</div>
          <q-input
            class="custom-input"
            outlined
            autocomplete="off"
            v-model="email"
            :rules="[(val) => !!val]"
            lazy-rules
            :error-message="t('mail_pls')"
            inputmode="email"
            :placeholder="t('mail_pls')"
          />
        </div>
        <div class="col">
          <div class="input-label">
            {{ t('pwd') }}
          </div>
          <q-input
            class="custom-input"
            outlined
            v-model="pwd"
            :type="isVisibleSetting ? 'text' : 'password'"
            :rules="[(val) => !!val]"
            lazy-rules
            :error-message="t('pwd_pls')"
            autocomplete="off"
            :placeholder="t('pwd_pls')"
          >
            <template v-slot:append>
              <q-icon
                :name="isVisibleSetting ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="() => (isVisibleSetting = !isVisibleSetting)"
              />
            </template>
          </q-input>
        </div>
        <div class="flex items-center my-2 policyTerms">
          <div>{{ t('policyBy') }}</div>
          <q-btn
            v-for="(title, index) in pdfTits"
            :key="index"
            flat
            dense
            no-caps
            @click="openPdf(index)"
            class="text-primary link-style"
          >
            {{ title }}
          </q-btn>
        </div>
        <q-btn
          class="login-btn-custom"
          color="blue-13"
          unelevated
          rounded
          type="submit"
          :label="t('login_but')"
          :loading="isLoging"
        />
      </div>
    </q-form>
  </div>

  <PdfViewer v-model="showPdf" :content="currentPdf" :title="currentPdfTit" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import PolicyCN from 'src/assets/pdf/k28DemoPolicyCN.pdf';
import PolicyEng from 'src/assets/pdf/k28DemoPolicyEng.pdf';
import TermsCN from 'src/assets/pdf/k28DemoTermsCN.pdf';
import TermsEng from 'src/assets/pdf/k28DemoTermsEng.pdf';
import useSuccessNotify from 'src/hooks/useSuccessNotify';
import { devEnv } from 'src/router/routes';
import { storageHelper } from 'src/utils/foragePkg';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useLogin } from './api';
import PdfViewer from './components/PdfViewer.vue';
import SecLogoLogin from 'src/assets/images/SecLogoLogin.png';

const { t, locale } = useI18n();
const router = useRouter();
const name = ref('DevChecker');

// demo func vue project
const $q = useQuasar();
function clickCheckName() {
  $q.notify({
    type: 'positive',
    message: `Mike check ${name.value}`,
    position: 'top',
    icon: 'check',
  });
}

// form and value
const email = ref(devEnv ? 'K28@gmail.com' : null);
const pwd = ref(devEnv ? '123k28' : null);
const isVisibleSetting = ref(false);

// mutation
const { run: testLog, loading: isLoging } = useLogin({
  onSuccess: () => {
    storageHelper<string | null>('email').setItem(email.value);
    storageHelper<string | null>('pwd').setItem(pwd.value);
    router.push({ name: 'home' });
    useSuccessNotify('Login successfully');
  },
});

// handlers
const handleSubmit = () => {
  testLog({
    Email: email?.value?.toString() as string,
    Pwd: pwd?.value?.toString() as string,
  });
};

// pdf control
const pdfCN = [PolicyCN, TermsCN];
const pdfEng = [PolicyEng, TermsEng];

const pdfTits = computed(() => [t('policyTit'), t('termTit')]);
const pdfFiles = computed(() => {
  if (locale.value === 'zh-TW') return pdfCN;
  if (locale.value === 'en-US') return pdfEng;
  return pdfCN;
});

const currentPdf = ref('');
const currentPdfTit = ref('');
const showPdf = ref(false);

const openPdf = (index: number) => {
  currentPdf.value = pdfFiles.value[index];
  currentPdfTit.value = pdfTits.value[index];
  showPdf.value = true;
};
</script>

<style scoped>
.login_container {
  margin-top: 10rem;
}
.q-form {
  max-width: 487px;
  margin: 0 auto;
}

.link-style {
  cursor: pointer;
  text-decoration: underline;
}
.link-style:hover {
  text-decoration: underline;
  opacity: 0.8;
}
.input-label {
  margin-bottom: 6px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  margin-top: 16px;
}
.custom-input >>> .q-field__control {
  background-color: rgba(234, 234, 234, 1);
}
body.dark-mode .custom-input >>> .q-field__control {
  background: rgba(43, 39, 68, 1);
}

.custom-input >>> input::placeholder {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
}

.login-btn-custom {
  width: 100%;
  height: 53px;
  border-radius: 7px;
  padding: 17px 221px;
  gap: 10px;
  background: rgba(125, 63, 250, 1) !important;
}
.policyTerms {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
</style>
