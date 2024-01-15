import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import { OrderStatusNum } from './live';
import { useStorage } from 'vue3-storage';

export const useOrderStore = defineStore('order', () => {
  const login_session = useStorage().getStorageSync('login_session');
  //
  const orderStatusObj = ref<{ [key: string]: OrderStatus | undefined }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: () => void }>({});
  const setOnMessage = (token: string, fn: () => void) => {
    onMessages.value[token] = fn;
  };
  const setOrderWs = (token: string, onOpen?: () => void) => {
    const isAlreadyConnected =
      Object.keys(webSockets?.value).findIndex(
        (socketKey) => socketKey === token
      ) !== -1;
    if (isAlreadyConnected) return;
    const orderStatusUrl = '/ws_orderstatus.ashx';
    const orderWs = new WebSocketClient(orderStatusUrl, {
      reconnectEnabled: true,
      reconnectInterval: 2000,
      isChat: false,
      order_token: token,
      login_session
    });
    orderWs.connect();
    orderWs.onMessage = (msg) => {
      if (msg?.data && typeof msg?.data === 'string') {
        const newOrderStatus: VirgilRes<OrderStatus> = JSON.parse(msg.data);
        orderStatusObj.value[token] = newOrderStatus.data;
      }
      if (onMessages?.value?.[token]) onMessages?.value?.[token]();
    };
    orderWs.onOpen = () => {
      console.info('OrderStatus WS open !, token:', token);
      if (onOpen) onOpen();
    };
    webSockets.value[token] = orderWs;
  };
  // 將已完成的交易的狀態WS斷開 並且回傳斷開的交易有哪些
  const removeOrder = () => {
    const tokens = Object.entries(orderStatusObj.value)
      .filter(([_, order]) => {
        return (
          order &&
          [
            OrderStatusNum.Cancel,
            OrderStatusNum.TimeOut,
            OrderStatusNum.Complete
          ].includes(order.Order_StatusID)
        );
      })
      .map(([token]) => token);
    tokens.forEach((token) => {
      delete orderStatusObj.value[token];
      delete webSockets.value[token];
      delete onMessages.value[token];
    });
    return tokens;
  };
  const gerOrderWs = (token: string) => {
    const result = webSockets?.value[token];
    return result;
  };
  const getStatus = (token: string) => {
    return orderStatusObj?.value[token];
  };

  return {
    setOrderWs,
    gerOrderWs,
    getStatus,
    setOnMessage,
    removeOrder
  };
});
