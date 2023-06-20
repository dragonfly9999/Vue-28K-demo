<script setup lang="ts">
import { useThirdStore } from 'src/stores';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStorage } from 'vue3-storage';
import { handleBoforeUpload } from 'src/utils/ImageManager';
import messageSound from 'src/assets/sound/message2.mp3';
import dayjs from 'dayjs';
import ImageMaster from 'src/components/ImageMaster.vue';
const {
  getWebSocket,
  getChatList,
  setOnMessage,
  handleResetCount,
  getCount,
  resetOnMessage,
} = useThirdStore();
const route = useRoute();
const btnIcon = ref<'arrow_drop_down' | 'arrow_drop_up'>('arrow_drop_up');
const text = ref<string>();
const hint = ref(true);
const filePicker = ref();
const file = ref();
const scrollArea = ref();
const messageAudio = ref();
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
// handlers
const handleSwitch = () => {
  handleResetCount();
  switch (btnIcon.value) {
    case 'arrow_drop_down':
      var element = document.getElementById('fade-in');
      if (element) {
        element.style.height = '60px';
      }
      btnIcon.value = 'arrow_drop_up';
      break;
    case 'arrow_drop_up':
      var element = document.getElementById('fade-in');
      if (element) {
        element.style.height = 'calc(100vh - 40px)';
      }
      btnIcon.value = 'arrow_drop_down';
      break;
  }
};

const handleUpload = async (info: File) => {
  const base64 = await handleBoforeUpload(info);
  const sendObj = {
    Message: base64,
    Message_Type: 2,
  };
  getWebSocket(route.query.token as string).send(JSON.stringify(sendObj));
};
const handleSent = () => {
  const sendObj = {
    Message: text.value,
    Message_Type: 1,
  };
  getWebSocket(route.query.token as string).send(JSON.stringify(sendObj));
  text.value = undefined;
};
// WS
onMounted(() => {
  if (getChatList(route.query.token as string)?.length > 1) {
    var element = document.getElementById('fade-in');
    if (element) {
      element.style.height = 'calc(100vh - 40px)';
    }
    btnIcon.value = 'arrow_drop_down';
  }
  setOnMessage(route.query.token as string, (msg) => {
    setTimeout(
      () => scrollArea.value?.setScrollPercentage('vertical', 1.1, 1000),
      100
    );
    if (messageAudio.value) {
      messageAudio.value?.pause();
      messageAudio.value.currentTime = 0;
      if (
        hint.value &&
        ((useStorage().getStorageSync('isAgent') && msg?.Message_Role !== 3) ||
          (useStorage().getStorageSync('isAgent') && msg?.Message_Role === 1))
      ) {
        messageAudio.value?.play();
      }
    }
  });
});
onBeforeUnmount(() => {
  resetOnMessage(route.query.token as string);
});
</script>
<template>
  <q-card class="q-pa-sm justify-between" id="fade-in">
    <q-toolbar class="flex q-mb-sm toolbar">
      <q-badge
        v-if="getCount() > 0"
        color="red"
        :label="getCount()"
        class="absolute-top-right"
      />
      <!-- 交易對話窗btn -->
      <q-icon name="chat" color="blue-13" size="24px" class="gt-md" />

      <q-btn
        class="lt-lg col-6 text-body1 text-weight-bold"
        align="left"
        flat
        dense
        color="blue-13"
        :icon="btnIcon"
        :label="$t('transaction.transaction_dialog_window')"
        @click="handleSwitch"
      />

      <!-- title 交易對話窗-->
      <div class="gt-md">
        {{ $t('transaction.transaction_dialog_window') }}
      </div>
      <q-space />
      <!-- 訊息提示音toggle -->
      <q-toggle
        dense
        color="blue-13"
        class="col-6 text-grey-6"
        :label="$t('transaction.message_notification_tone')"
        left-label
        v-model="hint"
      />
    </q-toolbar>

    <q-scroll-area ref="scrollArea" class="col scroll overflow-hidden">
      <div
        v-for="(msg, index) in getChatList(route.query.token as string)"
        :key="index"
      >
        <q-chat-message
          :name="$t(`chatName.${msg.Message_Role}`)"
          :sent="isAgent ? msg.Message_Role === 3 : msg.Message_Role === 1"
          :stamp="dayjs(msg.Sysdate).format('YYYY-MM-DD HH:mm:ss')"
          :key="msg.SysID"
          class="q-my-lg"
          :bg-color="isAgent && msg.Message_Role === 3 ? 'cyan-2' : 'grey-4'"
        >
          <div v-if="msg.Message_Type === 1">{{ msg.Message }}</div>

          <image-master v-else width="240px" :src="msg.Message" />
        </q-chat-message>
      </div>
    </q-scroll-area>

    <!-- 輸入訊息input -->
    <q-card-section class="footer q-px-md row">
      <q-input
        color="blue-13"
        v-model="text"
        :label="$t('transaction.input_message')"
        class="col-grow"
        @keyup.enter="handleSent"
      >
        <template v-slot:prepend>
          <q-icon
            class="send-image-btn cursor-pointer"
            name="attach_file"
            color="blue-13"
            @click="() => filePicker?.pickFiles()"
          />
        </template>
        <template v-slot:append>
          <q-icon
            @click="handleSent"
            name="send"
            color="blue-13"
            style="cursor: pointer"
          />
        </template>
      </q-input>
    </q-card-section>
  </q-card>

  <q-file
    @update:model-value="handleUpload"
    v-show="false"
    accept="image/*"
    v-model="file"
    ref="filePicker"
  />
  <audio :src="messageSound" ref="messageAudio" />
</template>

<style scoped>
#fade-in {
  border-top-left-radius: 30px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  z-index: 6;
  box-shadow: 0px -1px 5px rgba(0, 27, 61, 0.158);
  margin-left: 15px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  min-height: 100%;
  max-height: 100%;
}

@media screen and (max-width: 1439px) {
  #fade-in {
    margin-top: 20px;
    position: fixed;
    bottom: 0px;
    height: 60px;
    max-width: 96vw;
    width: calc((1700px - 48vw) / 2);
    margin-left: 0px;
    min-height: 0px;
    max-height: 100vh;
    transition: height 0.3141592s;
  }
}
.toolbar {
  height: 50px;
}
.scroll {
  height: calc(100% - 140px);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%);
}
.footer {
  height: 90px;
  box-shadow: 0px -7px 30px rgba(50, 50, 50, 0.1);
}
</style>
