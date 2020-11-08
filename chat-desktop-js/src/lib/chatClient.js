class ChatClient {

    constructor() {
        this.__connected = false;
    }

    connect(serverAddress) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(serverAddress);
                this.ws.onopen = () => this.sendMessage({ type: 'hello_server' });
                this.ws.onerror = (evt) => reject(evt);
                this.ws.onclose = (evt) => reject(evt);
                this.ws.onmessage = this.authenticate(resolve, reject);
                setTimeout(() => {
                    if (!this.connected) {
                        this.close();
                        reject({ message: 'time_out' });
                    }
                }, 10000);
            } catch (e) {
                reject(e);
            }
        });
    }

    authenticate(resolve, reject) {
        return (data) => {
            try {
                const json = JSON.parse(data);
                if (!this.connected && json.type == 'hello_client') {
                    this.__connected = true;
                    this.ws.onmessage = this.onMessage;
                    resolve();
                }
            } catch (e) {
                reject(e);
            }
        };
    }

    onMessage(msg) {
        console.log(msg);
    }

    sendMessage(data) {
        if (typeof data == "string") {
            this.ws.send(data);
        } else {
            this.ws.send(JSON.stringify(data));
        }
    }

    close() {
        try {
            this.ws.close();
        } catch (e) {
            console.error(e);
        }
    }

    get connected() {
        return this.__connected;
    }

}

export default new ChatClient();