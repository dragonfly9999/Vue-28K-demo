<template>
  <q-card class="q-pa-sm q-ma-sm q-mx-auto card">
    <div class="row q-mb-sm items-center">
      <div class="col-2"></div>
      <div class="col text-center text-h6 text-weight-bold">
        {{ $t('kyc.實名驗證') }}
        <!-- ()帳戶 -->
        <div class="text-overline text-primary">
          {{ $t(`kyc.CNY人民幣帳戶`) }}
        </div>
      </div>
      <div class="col-2 flex justify-end">
        <LeavingWarnBtn @confirm="() => $router.back()" />
      </div>
    </div>
    <q-separator />
    <div class="q-pa-md">
      <div class="flex items-center">
        <q-avatar size="20px" class="text-white q-mr-md" color="primary">
          1
        </q-avatar>
        <div class="text-subtitle1">
          {{ $t('kyc.基本驗證.title') }}
        </div>
      </div>
      <div
        class="bg-blue-grey-1 q-pa-sm"
        style="border-bottom-right-radius: 15px"
      >
        <div>
          {{ $t('kyc.基本驗證.content') }}
        </div>
      </div>
      <!-- 表單 -->
      <q-form @submit="handleCreate" class="q-gutter-y-sm q-mt-sm">
        <!-- 姓名 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.姓名') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="name"
          />
        </div>
        <!-- 民族 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.民族') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="nationality"
          />
        </div>
        <!-- 出生日期 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.出生日期') }}</div>
          <q-card>
            <q-btn flat :label="birth" class="full-width">
              <q-popup-proxy>
                <q-date minimal v-model="birth" />
              </q-popup-proxy>
            </q-btn>
          </q-card>
        </div>
        <!-- 住址 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.住址') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="address"
          />
        </div>
        <!-- 公民身份號碼 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.公民身份號碼') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="IdNumber"
          />
        </div>
        <!-- 簽發機關 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.簽發機關') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="issueAuthority"
          />
        </div>
        <!-- 有效期限 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.有效期限') }}</div>
          <q-card class="flex items-center justify-around">
            <q-btn flat :label="validityPeriod.from">
              <q-popup-proxy>
                <q-date minimal v-model="validityPeriod.from" />
              </q-popup-proxy>
            </q-btn>
            ~
            <q-btn flat :label="validityPeriod.to">
              <q-popup-proxy>
                <q-date minimal v-model="validityPeriod.to" />
              </q-popup-proxy>
            </q-btn>
          </q-card>
        </div>
        <!-- 填寫銀行資料 -->
        <div
          class="bg-blue-grey-1 q-pa-sm"
          style="border-bottom-right-radius: 15px"
        >
          <div>{{ $t('kyc.銀行資料.content') }}</div>
        </div>
        <!-- 銀行戶名 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.銀行戶名') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            :model-value="name"
            readonly
          />
        </div>
        <!-- 銀行帳號 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.銀行帳號') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="account"
          />
        </div>
        <!-- 開戶銀行 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.開戶銀行') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="bankID"
          />
        </div>
        <!-- 省分 -->
        <div>
          <div class="q-my-sm">{{ $t('kyc.省分') }}</div>
          <q-input
            lazy-rules
            :rules="[(val) => !!val || $t('error.input.empty')]"
            outlined
            v-model="province"
          />
        </div>
        <!-- 上傳圖片 -->
        <div class="q-mt-md flex items-center q-gutter-x-sm">
          <q-avatar size="20px" class="text-white" color="primary">2</q-avatar>
          <div class="text-subtitle1">{{ $t('kyc.上傳圖片.title') }}</div>
        </div>
        <div
          class="bg-blue-grey-1 q-pa-sm"
          style="border-bottom-right-radius: 15px"
        >
          {{ $t('kyc.上傳圖片.content') }}
        </div>
        <!-- 上傳圖片 -->
        <div>
          <!-- 1 -->
          <div class="q-my-sm">{{ $t('kyc.正面') }}</div>
          <PickImg v-model:base64="imgs.img1" :label="$t('kyc.正面')" />
          <!-- 2 -->
          <div class="q-my-sm">{{ $t('kyc.反面') }}</div>
          <PickImg v-model:base64="imgs.img1" :label="$t('kyc.反面')" />
          <!-- 3 -->
          <div class="q-my-sm">{{ $t('kyc.手持證件自拍照') }}</div>
          <PickImg
            v-model:base64="imgs.img1"
            :label="$t('kyc.手持證件自拍照')"
          />
          <!-- 4 -->
          <div class="q-my-sm">{{ $t('kyc.銀行帳戶信息截圖') }}</div>
          <PickImg
            v-model:base64="imgs.img1"
            :label="$t('kyc.銀行帳戶信息截圖')"
          />
        </div>
        <!-- 上傳圖片結尾 -->
        <q-btn
          :loading="loading"
          type="submit"
          class="full-width q-mt-md"
          color="primary"
          glossy
        >
          確認
        </q-btn>
      </q-form>
    </div>
  </q-card>
  <CreateSuccess
    :visible="isSuccess"
    @close="
      () => {
        isSuccess = false;
        useStorage().setStorageSync('to', '');
      }
    "
  />
</template>

<script setup lang="ts">
import data from './data';
import dayjs from 'dayjs';
import LeavingWarnBtn from 'src/components/LeavingWarnBtn.vue';
import PickImg from 'src/components/PickImg.vue';
import { reactive, ref } from 'vue';
import api from './api';
import CreateSuccess from './component/CreateSuccess.vue';
import { useStorage } from 'vue3-storage';
import { useRouter } from 'vue-router';

const router = useRouter();
//
const name = ref('');
const nationality = ref('');
const birth = ref(dayjs().subtract(20, 'year').format('YYYY/MM/DD'));
const address = ref('');
const IdNumber = ref('');
const issueAuthority = ref('');
const validityPeriod = reactive({
  from: dayjs().format('YYYY/MM/DD'),
  to: dayjs().add(3, 'year').format('YYYY/MM/DD'),
});
const account = ref('');
const bankID = ref('');
const province = ref('');
const imgs = reactive({
  img1: '',
  img2: '',
  img3: '',
  img4: '',
});
const isSuccess = ref(false);
// mutation
const { run: create, loading } = api.useCreate({
  onSuccess: () => {
    isSuccess.value = true;
    useStorage().setStorageSync('to', 'kyc');
  },
});
const handleCreate = () => {
  const Img2json = {
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    basic: {
      P1: {
        data: name.value,
        status: 1,
        reson: '',
      },
      P2: {
        data: birth.value,
        status: 1,
        reson: '',
      },
      P3: {
        data: IdNumber.value,
        status: 1,
        reson: '',
      },
      P4: {
        data: validityPeriod,
        status: 1,
        reson: '',
      },
      P5: {
        data: issueAuthority.value,
        status: 1,
        reson: '',
      },
      P6: {
        data: nationality.value,
        status: 1,
        reson: '',
      },
      P7: {
        data: address.value,
        status: 1,
        reson: '',
      },
      P8: {
        data: imgs.img2,
        status: 1,
        reson: '',
      },
      P9: {
        data: imgs.img3,
        status: 1,
        reson: '',
      },
      P10: {
        data: imgs.img4,
        status: 1,
        reson: '',
      },
    },
    bank: {
      P1: {
        data: name.value,
        status: 1,
        reson: '',
      },
      P2: {
        data: account.value,
        status: 1,
        reson: '',
      },
      P3: {
        data: province.value,
        status: 1,
        reson: '',
      },
      P4: {
        data: bankID.value,
        status: 1,
        reson: '',
      },
      Img1: {
        data: imgs.img1,
        status: 1,
        reson: '',
      },
    },
  };
  create({
    SType: 1, // 預設發送就是 1 代表這一筆的銀行帳戶驗證中，基本資料透過 P6 傳遞
    P1: name.value,
    P2: account.value,
    P3: province.value,
    P4: bankID.value,
    P5: 'CNY',
    Img1: imgs.img1,
    Img2: JSON.stringify(Img2json),
  });
};

// test
const isTest = true;
if (import.meta.env.DEV && isTest) {
  name.value = 'Ben test ' + dayjs().format('MM.DD HH:mm:ss');
  nationality.value = '民族';
  address.value = 'address';
  IdNumber.value = 'A123456789';
  issueAuthority.value = '上海簽發機關';
  account.value = '3434343223';
  bankID.value = '上海銀行';
  province.value = '地球省';
  imgs.img1 = data.img;
  imgs.img2 = data.img;
  imgs.img3 = data.img;
  imgs.img4 = data.img;
}
// 重新載入時，如果有已成功提交就導回
const to = useStorage().getStorageSync('to');
if (to) {
  useStorage().setStorageSync('to', '');
  router.push({ name: to });
}
// 回填資料 沒有
</script>
<style scoped lang="scss">
.card {
  width: 100%;
  max-width: 480px;
}
</style>
