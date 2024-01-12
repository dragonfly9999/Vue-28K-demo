import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import messageSound from 'src/assets/sound/message2.mp3';
import { useStorage } from 'vue3-storage';

export const useThirdStore = defineStore('third', () => {
  const hint = ref(false);
  const unReadCount = ref<{ [key: string]: number }>({});
  const chatListObj = ref<{ [key: string]: Array<ChatRes> }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: (args: ChatRes) => void }>({});
  const login_session = useStorage().getStorageSync('login_session');
  const isAgent = useStorage().getStorageSync('isAgent');

  const setOnMessage = (token: string, fn: (args?: ChatRes) => void) => {
    onMessages.value[token] = fn;
  };
  const resetOnMessage = (token: string) => {
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
  const setWebSockets = (token: string) => {
    const tokenArray = Object.entries(webSockets?.value).map(([key]) => key);

    if (tokenArray.every((key) => key !== token)) {
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
        order_token: token,
        login_session
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
      webSockets.value[token] = chatWS;
    }
  };
  //
  const handleResetCount = (token: string) => (unReadCount.value[token] = 0);
  const getCount = (token: string) => unReadCount.value?.[token] ?? 0;
  //
  const removeChat = (token: string) => {
    delete chatListObj.value[token];
    delete webSockets.value[token];
    delete onMessages.value[token];
    delete unReadCount.value[token];
  };
  const getWebSocket = (token: string) => {
    const result = webSockets?.value[token];
    return result;
  };
  const getChatList = (token: string) => {
    return chatListObj?.value[token] ?? [];
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
    getCount
  };
});
