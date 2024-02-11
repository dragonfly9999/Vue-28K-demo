<template>
  <div
    ref="layoutRef"
    id="layout"
    v-if="windowClientWidth"
    :class="{
      ['fixed-bottom']: windowClientWidth < breakPoint,
      ['zoom-out']: btnIcon === 'arrow_drop_up',
    }"
  >
    <q-card class="q-pa-sm" :="$attrs" ref="rootCardRef" id="root-card">
      <q-toolbar class="q-mb-sm" ref="headerRef" id="toolbar">
        <q-badge
          v-if="getCount(token) > 0"
          color="red"
          :label="getCount(token)"
          class="absolute-top-right"
        />

        <div>
          <q-icon name="chat" color="blue-13" size="24px" />
          {{ $t('transaction.transaction_dialog_window') }}
        </div>
        <q-space />
        <div class="flex items-center q-gutter-sm no-wrap">
          <q-toggle
            dense
            color="blue-13"
            class="col-auto text-grey-6"
            :label="$t('transaction.message_notification_tone')"
            left-label
            v-model="hint"
          />
          <q-btn
            v-if="windowClientWidth < breakPoint"
            class="text-body1 text-weight-bold"
            align="left"
            flat
            color="blue-13"
            :icon="btnIcon"
            @click="handleSwitch"
            dense
            rounded
          >
            <q-tooltip>
              {{ showTip }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>

      <q-scroll-area
        ref="scrollAreaRef"
        id="scroll-area"
        :class="{
          ['zoom-out']: btnIcon === 'arrow_drop_up',
        }"
      >
        <div v-for="(msg, index) in chatList" :key="index">
          <q-chat-message
            :name="
              (isAgent && msg.Message_Role !== 3) ||
              (!isAgent && msg.Message_Role !== 1)
                ? $t(`chatName.${msg.Message_Role}`)
                : ''
            "
            :sent="isAgent ? msg.Message_Role === 3 : msg.Message_Role === 1"
            :stamp="dayjs(msg.Sysdate).format('YYYY-MM-DD HH:mm:ss')"
            :key="msg.SysID"
            class="q-my-lg"
            :bg-color="
              (isAgent && msg.Message_Role === 3) ||
              (!isAgent && msg.Message_Role === 1)
                ? 'cyan-2'
                : 'grey-4'
            "
          >
            <div v-if="msg.Message_Type === 1">{{ msg.Message }}</div>

            <image-master
              @load="handleScrollBottom"
              v-else
              width="240px"
              :src="msg.Message"
            />
          </q-chat-message>
        </div>
      </q-scroll-area>
    </q-card>
    <!-- 輸入訊息input -->
    <div
      id="footer"
      class="q-px-md row"
      :class="{
        ['zoom-out']: btnIcon === 'arrow_drop_up',
      }"
    >
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
            @click="() => filePickerRef?.pickFiles()"
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
    </div>
    <q-file
      @update:model-value="handleUpload"
      v-show="false"
      accept="image/*"
      v-model="file"
      ref="filePickerRef"
    />
    <audio :src="messageSound" ref="messageAudioRef" />
  </div>
</template>

<script setup lang="ts">
import { useThirdStore } from 'src/stores';
import { VNodeRef, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStorage } from 'vue3-storage';
import { handleBoforeUpload } from 'src/utils/ImageManager';
import messageSound from 'src/assets/sound/message2.mp3';
import dayjs from 'dayjs';
import ImageMaster from 'src/components/ImageMaster.vue';
import hooks from 'src/hooks';
import { useI18n } from 'vue-i18n';
const props = withDefaults(
  defineProps<{
    token: string | undefined;
    tip?: string;
    breakPoint?: number;
  }>(),
  { breakPoint: 600 }
);
const { t } = useI18n();
// DOM
const windowClientWidth = ref<number>();
const btnIcon = ref<'arrow_drop_down' | 'arrow_drop_up'>('arrow_drop_up');
const text = ref('');
const hint = ref(false);
const file = ref<File>();
const showTip = computed(() => {
  if (props.tip) return props.tip;
  if (btnIcon.value === 'arrow_drop_down') return t('chat.縮小');
  return t('chat.展開');
});
const {
  getWebSocket,
  getChatList,
  setOnMessage,
  handleResetCount,
  getCount,
  resetOnMessage,
} = useThirdStore();
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const chatList = computed(() => getChatList(props.token));
// handlers
const handleSwitch = () => {
  handleResetCount(props.token);
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
  const chatWS = getWebSocket(props.token);
  if (chatWS === undefined) {
    hooks.useInfoNotify('Not find chatWS, token:' + props.token);
    return;
  }
  const base64 = await handleBoforeUpload(info);
  const sendObj = {
    Message: base64,
    Message_Type: 2,
  };
  chatWS.send(JSON.stringify(sendObj));
};
const handleSent = () => {
  const chatWS = getWebSocket(props.token);
  if (chatWS === undefined) {
    hooks.useInfoNotify('Not find chatWS, token:' + props.token);
    return;
  }
  const sendObj = {
    Message: text.value,
    Message_Type: 1,
  };
  chatWS.send(JSON.stringify(sendObj));
  text.value = '';
};

// life cycle
const layoutRef = ref<VNodeRef | null>(null);
const rootCardRef = ref<VNodeRef | null>(null);
const headerRef = ref<VNodeRef | null>(null);
const scrollAreaRef = ref<VNodeRef | null>(null);
const filePickerRef = ref<VNodeRef | null>(null);
const messageAudioRef = ref<VNodeRef | null>(null);

const handleScrollBottom = () => {
  setTimeout(
    () => scrollAreaRef.value?.setScrollPercentage('vertical', 1, 200),
    100
  );
};

onMounted(() => {
  windowClientWidth.value = window.innerWidth;
  window.onresize = () => {
    windowClientWidth.value = window.innerWidth;
  };

  // 當有訊息時自動彈起
  setTimeout(() => (btnIcon.value = 'arrow_drop_down'));

  if (props.token)
    setOnMessage(props.token, (msg) => {
      handleScrollBottom();
      if (messageAudioRef.value) {
        messageAudioRef.value?.pause();
        messageAudioRef.value.currentTime = 0;
        if (
          hint.value &&
          ((useStorage().getStorageSync('isAgent') &&
            msg?.Message_Role !== 3) ||
            (!useStorage().getStorageSync('isAgent') &&
              msg?.Message_Role !== 1))
        ) {
          messageAudioRef.value?.play();
        }
      }
    });

  // 當全局的hint沒有被關閉時自動開啟訊息提醒
  if (useThirdStore().hint) {
    setTimeout(() => (hint.value = true), 500);
  }
});
onBeforeUnmount(() => {
  if (props.token) resetOnMessage(props.token as string);
});

defineExpose({
  elementRefs: {
    layout: layoutRef,
    rootCard: rootCardRef,
    header: headerRef,
    scrollArea: scrollAreaRef,
    filePicker: filePickerRef,
    messageAudio: messageAudioRef,
  },
});
</script>

<script lang="ts">
export type ChatExposeElements = {
  layout: VNodeRef | null;
  rootCard: VNodeRef | null;
  header: VNodeRef | null;
  scrollArea: VNodeRef | null;
  filePicker: VNodeRef | null;
  messageAudio: VNodeRef | null;
};
</script>

<style scoped lang="scss">
#layout {
  border-top-left-radius: 30px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0px -1px 5px rgba(0, 27, 61, 0.158);
  height: 100%;
  overflow: hidden;
  z-index: 700;
  background-color: white;
  transition: height 0.5s ease-in-out;
  #root-card {
    /* 高度保留底部 footer */
    height: calc(100% - 70px);
    width: 100%;
  }

  &.fixed-bottom {
    height: 80vh;
    position: fixed;
    bottom: 0px;
    width: calc(100% - 10px);
    left: 5px;
  }
  &.zoom-out {
    height: 60px;
    // height: 80vh;
  }
}

#scroll-area {
  /* 高度保留 header */
  height: calc(100% - 50px);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%);
  transform: translate(0, 0px);
  opacity: 1;
  transition: transform 0.5 ease-in-out, opacity 0.5 ease-in-out;
  &.zoom-out {
    transition: transform 0.5 ease-in-out, opacity 0.5 ease-in-out;
    opacity: 0.5;
    transform: translate(0, calc(130% + 70px));
  }
}
#footer {
  height: 70px;
  box-shadow: 0px -7px 30px rgba(50, 50, 50, 0.1);
  transform: translate(0, 0%);
  opacity: 1;
  transition: transform 0.5 ease-in-out, opacity 0.5 ease-in-out;
  &.zoom-out {
    transition: transform 0.5 ease-in-out, opacity 0.5 ease-in-out;
    opacity: 0.5;
    transform: translate(0, 90%);
  }
}

#toolbar {
  /* 縮小時保留toolbar的高度即可 */
  background-color: white;
  height: 50px;
}
</style>
