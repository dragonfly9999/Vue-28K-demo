import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import { OrderStatusNum } from './live';

export const useOrderStore = defineStore('order', () => {
  const orderStatusObj = ref<{ [key: string]: OrderStatus }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: () => void }>({});
  const setOnMessage = (token: string, fn: () => void) => {
    onMessages.value[token] = fn;
  };
  const setOrderWs = (token: string) => {
    const tokenArray = Object.entries(webSockets?.value).map(([key]) => key);
    if (tokenArray.every((key) => key !== token)) {
      const orderStatusUrl = '/ws_orderstatus.ashx';
      const orderWs = new WebSocketClient(orderStatusUrl, {
        reconnectEnabled: true,
        reconnectInterval: 2000,
        isChat: false,
        order_token: token
      });
      orderWs.connect();
      orderWs.onMessage = (msg) => {
        if (msg?.data && typeof msg?.data === 'string') {
          const newOrderStatus: VirgilRes<OrderStatus> = JSON.parse(msg.data);
          console.log('on Message:status:', newOrderStatus);
          orderStatusObj.value[token] = newOrderStatus.data;
        }
        if (onMessages?.value?.[token]) onMessages?.value?.[token]();
      };
      webSockets.value[token] = orderWs;
    }
  };
  const removeOrder = () => {
    const tokens = Object.entries(orderStatusObj.value).map(
      ([token, order]) => {
        if (
          [
            OrderStatusNum.Cancel,
            OrderStatusNum.TimeOut,
            OrderStatusNum.Complete
          ].includes(order.Order_StatusID)
        )
          return token;
      }
    );
    tokens.forEach((token) => {
      if (token) {
        delete orderStatusObj.value[token];
        delete webSockets.value[token];
        delete onMessages.value[token];
      }
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
