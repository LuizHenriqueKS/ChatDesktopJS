import IChatClient from './IChatClient';
import WebSocket from 'ws';

export default class ChatClientImpl implements IChatClient {

    #ws: WebSocket;
    #id: number;

    constructor(ws: WebSocket) {
        this.#ws = ws;
        this.#id = Math.random();
    }

    get id(): number {
        return this.#id;
    }

    send(message: any): void {
        if (typeof message == "string") {
            this.#ws.send(message);
        } else {
            this.#ws.send(JSON.stringify(message));
        }
    }

    close(): void {
        this.#ws.close();
    }

}