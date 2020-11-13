class ChatClient {

    enterChatListener = [];
    textMessageListener = [];

    constructor() {
        this.__connected = false;
    }

    connect(serverAddress) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(serverAddress);
                this.ws.onopen = () => this.sendMessage({ type: 'hello_server' });
                this.ws.onerror = (evt) => reject(evt);
                this.ws.onclose = (evt) => {
                    this.onDisconnect(evt);
                    reject(evt);
                };
                this.ws.onmessage = this.authenticate(resolve, reject);
                setTimeout(() => {
                    if (!this.connected) {
                        this.disconnect();
                        reject({ message: 'time_out' });
                    }
                }, 10000);
            } catch (e) {
                reject(e);
            }
        });
    }

    authenticate(resolve, reject) {
        return (evt) => {
            try {
                const json = JSON.parse(evt.data);
                if (!this.connected && json.type == 'hello_client') {
                    this.__connected = true;
                    this.ws.onmessage = (evt) => this.onMessage.call(this, evt);
                    resolve();
                }
            } catch (e) {
                reject(e);
            }
        };
    }

    onMessage(msg) {
        try {
            const json = JSON.parse(msg.data);
            const type = json.type;
            if (type == "enter_chat") {
                this.onEnterChat(json);
            } else if (type == "text_message") {
                this.onTextMessage(json);
            }
        } catch (e) {
            this.disconnect();
        }
    }

    onEnterChat() {
        this.enterChatListener.forEach(l => l());
    }

    onTextMessage(message) {
        this.textMessageListener.forEach(l => l(message));
    }

    onDisconnect() {
        this.__connected = false;
    }

    updateUserInfo(userInfo) {
        const message = {};
        message.type = 'user_info';
        message.name = userInfo.name;
        this.sendMessage(message);
    }

    sendMessage(data) {
        if (typeof data == "string") {
            this.ws.send(data);
        } else {
            this.ws.send(JSON.stringify(data));
        }
    }

    disconnect() {
        try {
            this.ws.close();
        } catch (e) {
            console.error(e);
        } finally {
            this.__connected = false;
        }
    }

    get connected() {
        return this.__connected;
    }

}

export default new ChatClient();