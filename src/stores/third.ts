import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import messageSound from 'src/assets/sound/message2.mp3';
import { useStorage } from 'vue3-storage';
import { useOrderStore } from './order';
import hooks from 'src/hooks';

export const useThirdStore = defineStore('third', () => {
  const hint = ref(false);
  const unReadCount = ref<{ [key: string]: number }>({});
  const chatListObj = ref<{ [key: string]: Array<ChatRes> }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: (args: ChatRes) => void }>({});

  const setOnMessage = (token: string, fn: (args?: ChatRes) => void) => {
    onMessages.value[token] = fn;
  };
  const resetOnMessage = (token: string) => {
    const isAgent = useStorage().getStorageSync('isAgent');

    setOnMessage(token, (msg?: ChatRes) => {
      if (hint.value) {
        if (
          (isAgent && msg?.Message_Role !== 3) ||
          (!isAgent && msg?.Message_Role === 3)
        ) {
          const messageAudio = new Audio(messageSound);
          messageAudio.play();
        }
      }
    });
  };
  const setWebSockets = (token: string, onOpen?: () => void) => {
    const isAgent = useStorage().getStorageSync('isAgent');

    if (token in webSockets.value && [0, 1].includes(webSockets.value[token].instance?.readyState ?? -1)) return;
    // set on message
    const tokens = Object.entries(chatListObj?.value).map(([key]) => key);
    if (!tokens.includes(token)) {
      resetOnMessage(token);
    }
    // WS
    const chatURL = isAgent ? '/ws_ChatOrder3.ashx' : '/WS_ChatOrder.ashx';
    const chatWS = new WebSocketClient(chatURL, {
      reconnectEnabled: true,
      reconnectInterval: 2000,
      isChat: true,
      order_token: token
    });
    chatWS.connect();
    chatWS.onMessage = (msg) => {
      if (msg?.data && typeof msg?.data === 'string') {
        const newList: Array<ChatRes> | ChatRes = JSON.parse(msg.data);
        if (Array.isArray(newList)) {
          chatListObj.value[token] = newList.reverse();
        } else {
          chatListObj.value[token].push(newList);
          if (onMessages?.value?.[token]) onMessages?.value?.[token](newList);
          if (
            (isAgent && newList?.Message_Role !== 3) ||
            (!isAgent && newList.Message_Role === 3)
          )
            unReadCount.value[token] = unReadCount.value[token]
              ? unReadCount.value[token] + 1
              : 1;
        }
      }
    };
    chatWS.onOpen = () => {
      if (import.meta.env.DEV) console.info('ChatWs open !, token:', token);
      useOrderStore().setOrderWs(token);
      if (onOpen) onOpen();
    };
    webSockets.value[token] = chatWS;
  };
  //
  const handleResetCount = (token: string | undefined) => {
    if(token &&  token in unReadCount.value ) unReadCount.value[token] = 0
  };
  const getCount = (token: string | undefined) => {
    console.log('on get count1', {
      token,
      unRead: unReadCount.value[token as string]
    });
    if (token === undefined || !(token in unReadCount.value)) return 0
    return unReadCount.value[token]
  };
  //
  const removeChat = (token: string) => {
    delete chatListObj.value[token];
    delete webSockets.value[token];
    delete onMessages.value[token];
    delete unReadCount.value[token];
  };
  const getWebSocket = (token: string | undefined) => {
    if (token === undefined) return undefined
    return webSockets?.value[token];
  };
  const getChatList = (token: string | undefined) => {
    if (token === undefined) return undefined;
    return chatListObj?.value[token] ?? [];
  };

  const resetThirdStore = () => {
    hint.value = false;
    unReadCount.value = {};
    chatListObj.value = {};
    Object.values(webSockets.value).forEach((webSocket) => {
      try {
        webSocket.instance?.close();
      } catch (error) {
        hooks.useInfoNotify('Reset third error:' + error);
      }
    });
    webSockets.value = {};
    onMessages.value = {};
  };

  return {
    hint,
    resetOnMessage,
    setWebSockets,
    getWebSocket,
    getChatList,
    setOnMessage,
    removeChat,
    handleResetCount,
    getCount,
    resetThirdStore
  };
});
