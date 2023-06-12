import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import { useStorage } from 'vue3-storage';

export const useThirdStore = defineStore('third', () => {
  const chatListObj = ref<{ [key: string]: Array<ChatRes> }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: (args: ChatRes) => void }>({});
  const setOnMessage = (token: string, fn: (args?: ChatRes) => void) => {
    onMessages.value[token] = fn;
  };
  const setWebSockets = (token: string) => {
    const tokenArray = Object.entries(webSockets?.value).map(([key]) => key);
    if (tokenArray.every((key) => key !== token)) {
      const isAgent = useStorage().getStorageSync('isAgent');
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
          }
        }
      };
      webSockets.value[token] = chatWS;
    }
  };
  const removeChat = (token: string) => {
    delete chatListObj.value[token];
    delete webSockets.value[token];
    delete onMessages.value[token];
  };
  const getWebSocket = (token: string) => {
    const result = webSockets?.value[token];
    return result;
  };
  const getChatList = (token: string) => {
    return chatListObj?.value[token];
  };

  return {
    setWebSockets,
    getWebSocket,
    getChatList,
    setOnMessage,
    removeChat
  };
});
