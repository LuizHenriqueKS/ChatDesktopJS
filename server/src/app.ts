import * as WebSocket from 'ws';
import ChatServer from './chat/ChatServer';
import ChatClient from './chat/ChatClientImpl';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

console.log(`Iniciando websocket server: ${PORT}...`);
const wss: WebSocket.Server = new WebSocket.Server({ port: PORT }, () => {
    console.log("Servidor iniciado com sucesso.");
});

const chatServer: ChatServer = new ChatServer();

wss.on('connection', (ws: WebSocket) => {

    const cli: ChatClient = new ChatClient(ws);

    chatServer.onConnect(cli);

    ws.on('message', (message: string) => {
        try {
            chatServer.onMessage(cli, JSON.parse(message));
        } catch (e) {
            chatServer.onMessage(cli, message);
        }
    });

    ws.on('close', (ws: WebSocket) => {
        chatServer.onDisconnect(cli);
    });

});