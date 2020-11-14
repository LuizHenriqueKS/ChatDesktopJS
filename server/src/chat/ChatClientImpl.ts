import IChatClient from './IChatClient';
import WebSocket from 'ws';

export default class ChatClientImpl implements IChatClient {
    #ws: WebSocket;
    #id: number;
    authenticated: boolean;

    constructor (ws: WebSocket) {
      this.#ws = ws;
      this.#id = Math.random();
      this.authenticated = false;
    }

    get id (): number {
      return this.#id;
    }

    send (message: any): void {
      console.log(`Enviado (para: ${this.id}):`, message);
      if (typeof message === 'string') {
        this.#ws.send(message);
      } else {
        this.#ws.send(JSON.stringify(message));
      }
    }

    close (): void {
      this.#ws.close();
    }
}
