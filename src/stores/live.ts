import { defineStore } from 'pinia';
import WebSocketClient from 'src/utils/WebsocketClient';
import { reactive } from 'vue';
import { useStorage } from 'vue3-storage';
import { useThirdStore } from './third';

enum MtTypeNum {
  Buy = 2,
  Sell = 1,
}
enum OrderStatusNum {
  Matching = 31,
  Assigned = 33,
  Committed = 34,
  Appeal = 35,
  Complete = 1,
  Cancel = 99,
  TimeOut = 98,
}
type LiveType = 'instant' | 'progress';

export const useLiveStore = defineStore('live', () => {
  const { setWebSockets: setThird } = useThirdStore();
  const liveWs = reactive<{ [key in LiveType]: WebSocketClient | null }>({
    instant: null,
    progress: null,
  });
  const liveOrders = reactive<{ [key in LiveType]: Array<LiveOrder> }>({
    instant: [],
    progress: [],
  });
  const liveMessages = reactive<{
    [key in LiveType]: (args?: Array<LiveOrder>) => void;
  }>({
    instant: () => {
      console.log('instant on message');
    },
    progress: () => {
      console.log('progress on message');
    },
  });

  const setOrders = (login_session: string) => {
    const defaultOptions = {
      reconnectEnabled: true,
      reconnectInterval: 2000,
      isChat: false,
      login_session,
    };
    const isAgent = useStorage().getStorageSync('isAgent');
    if (isAgent) {
      if (!liveWs.instant) {
        const instantURL = '/ws_liveorders.ashx';
        liveWs.instant = new WebSocketClient(instantURL, defaultOptions);
        liveWs.instant.connect();
        liveWs.instant.onMessage = (msg) => {
          if (msg?.data && typeof msg?.data === 'string') {
            const newList: VirgilRes<Array<LiveOrder>> | VirgilRes<LiveOrder> =
              JSON.parse(msg.data);
            if (Array.isArray(newList.data)) {
              liveOrders.instant = newList.data.reverse();
              liveMessages.instant(newList.data);
            } else {
              liveOrders.instant.push(newList.data);
            }
          }
        };
      }
      if (!liveWs.progress) {
        const progressURL = '/WS_livePendingOrders.ashx';
        liveWs.progress = new WebSocketClient(progressURL, defaultOptions);
        liveWs.progress.connect();
        liveWs.progress.onMessage = (msg) => {
          if (msg?.data && typeof msg?.data === 'string') {
            const newList: VirgilRes<Array<LiveOrder>> | VirgilRes<LiveOrder> =
              JSON.parse(msg.data);
            if (Array.isArray(newList.data)) {
              liveOrders.progress = newList.data.reverse();
              liveMessages.progress(newList.data);
              newList.data.forEach((order) => {
                setThird(order.token);
              });
            } else {
              liveOrders.progress.push(newList.data);
            }
          }
        };
      }
    }
  };
  const getOrders = (arg: LiveType) => liveOrders[arg];

  const setOnMessage = ({
    type,
    fn,
  }: {
    type: LiveType;
    fn: (args?: Array<LiveOrder> | undefined) => void;
  }) => {
    liveMessages[type] = fn;
  };

  const cleanLive = () => {
    liveWs.instant = null;
    liveWs.progress = null;
    liveOrders.instant = [];
    liveOrders.progress = [];
  };

  return {
    setOrders,
    getOrders,
    setOnMessage,
    cleanLive,
  };
});
export { MtTypeNum, OrderStatusNum };
