import IChatClient from './IChatClient';
import * as WebSocket from 'ws';
import { createPublicKey } from 'crypto';

export default class ChatServer {

    #clients = [];

    public constructor() {

    }

    onConnect(cli: IChatClient) {
        cli.send({ type: 'hello_client' })
    }

    onDisconnect(cli: IChatClient) {

    }

    onMessage(cli: IChatClient, message: any): void {
        console.log(cli.id, message);
    }

}