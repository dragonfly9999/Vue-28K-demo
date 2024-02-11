import { defineStore } from 'pinia';
import hooks from 'src/hooks';
import WebSocketClient from 'src/utils/WebsocketClient';
import { ref } from 'vue';
import { OrderStatusNum } from './live';

export const useOrderStore = defineStore('order', () => {
  const orderStatusObj = ref<{ [key: string]: OrderStatus | undefined }>({});
  const webSockets = ref<{ [key: string]: WebSocketClient }>({});
  const onMessages = ref<{ [key: string]: () => void }>({});
  //
  const setOnMessage = (token: string, fn: () => void) => {
    onMessages.value[token] = fn;
  };
  const setOrderWs = (token: string, onOpen?: () => void) => {
    if ( token in webSockets.value ) {
      const { instance } = webSockets.value[token] || {};
      if (instance && [0, 1].includes(instance.readyState)) return;
    }
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
        orderStatusObj.value[token] = newOrderStatus.data;
      }
      if (onMessages?.value?.[token]) onMessages?.value?.[token]();
    };
    orderWs.onOpen = () => {
      if (import.meta.env.DEV)
        console.info('OrderStatus WS open !, token:', token);
      if (onOpen) onOpen();
    };
    webSockets.value[token] = orderWs;
  };
  // 將已完成的交易的狀態WS斷開 並且回傳斷開的交易有哪些
  const removeOrder = (besidesToken?: string) => {
    const tokens = Object.entries(orderStatusObj.value)
      .filter(([token, order]) => {
        return (
          order &&
          [
            OrderStatusNum.Cancel,
            OrderStatusNum.TimeOut,
            OrderStatusNum.Complete
          ].includes(order.Order_StatusID) &&
          besidesToken !== token
        );
      })
      .map(([token]) => token);
    tokens.forEach((token) => {
      try {
        webSockets.value[token].instance?.close();
        delete orderStatusObj.value[token];
        delete webSockets.value[token];
        delete onMessages.value[token];
      } catch (error) {
        hooks.useInfoNotify('Close order status error, error:' + error);
      }
    });
    return tokens;
  };
  const gerOrderWs = (token: string) => {
    const result = webSockets?.value[token];
    return result;
  };
  const getStatus = (token: string | undefined) => {
    if (token === undefined) return undefined;
    return orderStatusObj?.value[token];
  };

  const resetOrderStore = () => {
    orderStatusObj.value = {};
    Object.values(webSockets.value).forEach((webSocket) => {
      try {
        webSocket.instance?.close();
      } catch (error) {
        hooks.useInfoNotify('Reset Order store error:' + error);
      }
    });
    webSockets.value = {};
    onMessages.value = {};
  };

  return {
    setOrderWs,
    gerOrderWs,
    getStatus,
    setOnMessage,
    removeOrder,
    resetOrderStore
  };
});
