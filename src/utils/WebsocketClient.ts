export default class WebSocketClient {
  instance?: WebSocket;
  url: string;
  options: WebsocketOptions;
  reconnectEnabled: boolean;
  reconnectInterval: number;
  onOpen: (() => void) | null = null;
  onMessage: ((msg: MessageEvent) => void) | null = null;
  onClose: ((evt: CloseEvent) => void) | null = null;
  onError: ((evt: Event) => void) | null = null;
  // constructor
  constructor(url: string, options: WebsocketOptions) {
    const OrderURL = import.meta.env.DEV
      ? 'wss://demo.k100u.com/j'
      : `wss://${window.location.hostname}/j`;
    const ChatURL = 'wss://chat.u28exchange.com';
    const baseURL = options.isChat ? ChatURL : OrderURL;
    this.url =
      baseURL +
      url +
      '?login_session=' +
      options.login_session +
      '&order_token=' +
      options.order_token;

    this.options = options;

    this.reconnectEnabled = options?.reconnectEnabled || false;
    if (this.reconnectEnabled)
      this.reconnectInterval = options?.reconnectInterval || 0;
    else this.reconnectInterval = -1;

    this.onOpen = null;
    this.onMessage = null;
    this.onClose = null;
    this.onError = null;
  }

  connect() {
    this.instance = new WebSocket(this.url);
    if (this.instance) {
      this.instance.onopen = () => {
        if (typeof this.onOpen === 'function') {
          this.onOpen();
        }
      };
      this.instance.onmessage = (msg) => {
        if (typeof this.onMessage === 'function') {
          this.onMessage(msg);
        }
      };
      this.instance.onclose = (evt) => {
        if (typeof this.onClose === 'function') {
          this.onClose(evt);
        }
        if (!evt.wasClean && this.reconnectEnabled) {
          this.reconnect();
        }
      };
      this.instance.onerror = (evt) => {
        if (typeof this.onError === 'function') {
          this.onError(evt);
        }
      };
    }
  }

  reconnect() {
    if (this.instance) delete this.instance;
    if (this.reconnectInterval >= 0)
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
  }

  send(message: string) {
    if (this.instance) this.instance.send(message);
  }

  sendObj(data: object) {
    if (this.instance) this.instance.send(JSON.stringify(data));
  }

  removeListeners() {
    if (this.instance) {
      this.onOpen = null;
      this.onMessage = null;
      this.onClose = null;
      this.onError = null;
    }
  }
}
