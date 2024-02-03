import { defineStore } from 'pinia';
import hooks from 'src/hooks';
import WebSocketClient from 'src/utils/WebsocketClient';
import { reactive } from 'vue';
import { useStorage } from 'vue3-storage';
import { useThirdStore } from './third';

enum MtTypeNum {
  Buy = 2,
  Sell = 1,
  CantTake = 4
}
enum OrderStatusNum {
  Matching = 31,
  Assigned = 33,
  Committed = 34,
  Appeal = 35,
  Complete = 1,
  Cancel = 99,
  TimeOut = 98
}
type LiveType = 'instant' | 'progress';

type SetOnMessageProps = {
  type: LiveType;
  messageName: string;
  fn: (args?: Array<LiveOrder> | undefined) => void;
};

const defaultOptions = {
  reconnectEnabled: true,
  reconnectInterval: 2000,
  isChat: false
};

export const useLiveStore = defineStore('live', () => {
  const liveWs: { [key in LiveType]: WebSocketClient | null } = {
    instant: null,
    progress: null
  };

  const liveMessages: {
    [key in LiveType]: {
      [messageName: string]: (args?: Array<LiveOrder>) => void;
    };
  } = {
    instant: {},
    progress: {}
  };

  const liveOrders = reactive<{ [key in LiveType]: Array<LiveOrder> }>({
    instant: [],
    progress: []
  });

  const liveWsConnecting = reactive({
    instant: false,
    progress: false
  });
  const setLiveOrderWs = () => {
    const isAgent = useStorage().getStorageSync('isAgent');
    if (!isAgent) return;
    if (
      liveWs.instant &&
      liveWs.instant.instance &&
      [0, 1].includes(liveWs.instant.instance?.readyState)
    )
      return;
    const instantURL = '/ws_liveorders.ashx';
    liveWs.instant = new WebSocketClient(instantURL, defaultOptions);
    liveWs.instant.connect();
    liveWs.instant.onMessage = (msg) => {
      if (msg?.data && typeof msg?.data === 'string') {
        let parseInfo: VirgilRes<Array<LiveOrder>> | VirgilRes<LiveOrder>;
        try {
          parseInfo = JSON.parse(msg.data);
        } catch (error) {
          hooks.useInfoNotify(
            'InstantOrders parse error on message, message:' + msg?.data
          );
          return;
        }
        liveOrders.instant = Array.isArray(parseInfo.data)
          ? parseInfo.data
          : [parseInfo.data];

        Object.values(liveMessages.instant).forEach((messageFn) => {
          messageFn(liveOrders.instant);
        });
      }
    };
    // loading
    liveWsConnecting.instant = true;
    liveWs.instant.onOpen = () => {
      setTimeout(() => (liveWsConnecting.instant = false), 1000);
    };
    liveWs.instant.onError = () => (liveWsConnecting.instant = false);
  };

  const setPendingOrderWs = () => {
    if (!liveWs.progress) {
      const progressURL = '/WS_livePendingOrders.ashx';
      liveWs.progress = new WebSocketClient(progressURL, defaultOptions);
      liveWs.progress.connect();
      liveWs.progress.onMessage = (msg) => {
        if (msg?.data) {
          let parseInfo: VirgilRes<Array<LiveOrder>> | VirgilRes<LiveOrder>;
          try {
            parseInfo = JSON.parse(msg.data);
          } catch (error) {
            hooks.useInfoNotify(
              'PendingOrders parse error on message, message:' + msg?.data
            );
            return;
          }
          liveOrders.progress = Array.isArray(parseInfo.data)
            ? parseInfo.data
            : [parseInfo.data];

          // 先連上三方聊天室的WS -> chatWs.onOpen 後再連上 orderStatusWs
          liveOrders.progress.forEach((order) => {
            useThirdStore().setWebSockets(order.token);
          });

          // 設定OnMessage
          Object.values(liveMessages.progress).forEach((onMessageFn) =>
            onMessageFn(liveOrders.progress)
          );
        }
      };
      // loading
      liveWsConnecting.progress = true;
      liveWs.progress.onOpen = () => {
        setTimeout(() => (liveWsConnecting.progress = false), 1000);
      };
      liveWs.progress.onError = () => (liveWsConnecting.progress = false);
    }
  };
  const getOrders = (arg: LiveType) => liveOrders[arg];

  const setOnMessage = ({ type, messageName, fn }: SetOnMessageProps) => {
    liveMessages[type][messageName] = fn;
  };

  const cleanLiveOrders = () => {
    if (liveWs.instant?.instance) {
      try {
        liveWs.instant.instance.close();
        liveWs.instant = null;
      } catch (error) {
        hooks.useInfoNotify('Close live instant orders error, error:' + error);
      }
    }
    if (liveWs.progress?.instance) {
      try {
        liveWs.progress.instance.close();
        liveWs.progress = null;
      } catch (error) {
        hooks.useInfoNotify('Close live pending orders error, error:' + error);
      }
    }
    liveMessages.instant = {};
    liveMessages.progress = {};
    liveOrders.instant = [];
    liveOrders.progress = [];
  };

  return {
    liveWsConnecting,
    setLiveOrderWs,
    setPendingOrderWs,
    getOrders,
    setOnMessage,
    cleanLiveOrders
  };
});
export { MtTypeNum, OrderStatusNum };
