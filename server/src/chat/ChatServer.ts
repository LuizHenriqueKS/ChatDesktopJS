import IChatClient from './IChatClient';
import ChatClientInfo from './ChatClientInfo';
import { ChatClientInfoNotFoundException } from './ChatClientInfoNotFound';

export default class ChatServer {
    #clients: IChatClient[] = [];
    #clientInfos: Map<Number, ChatClientInfo> = new Map();

    onConnect (cli: IChatClient): void {
      this.#clients.push(cli);

      const clientInfo = new ChatClientInfo();
      clientInfo.client = cli;
      this.#clientInfos.set(cli.id, clientInfo);

      cli.send({ type: 'hello_client' });
    }

    onDisconnect (cli: IChatClient): void {
      const clientIndex = this.#clients.findIndex(c => c.id === cli.id);
      this.#clients.splice(clientIndex, 1);
      this.#clientInfos.delete(cli.id);
      this.sendUsersInfoToClients();
    }

    onMessage (cli: IChatClient, message: any): void {
      try {
        console.log(`Recebido (de ${cli.id}):`, message);
        const type = this.getType(message);
        const authenticated = this.getClientInfo(cli).authenticated;
        if (type === 'hello_server') {
          this.getClientInfo(cli).authenticated = true;
        } else if (authenticated && type === 'user_info') {
          this.onMessageUserInfo(cli, message);
        } else if (authenticated && type === 'text_message') {
          this.onMessageText(cli, message);
        } else {
          cli.close();
        }
      } catch (e) {
        cli.close();
      }
    }

    onMessageUserInfo (cli: IChatClient, message: any): void {
      if (message && typeof message.name === 'string' && message.name.trim() !== '') {
        if (this.checkUsernameAlreadyExists(message.name)) {
          cli.send({ type: 'username_already_exists' });
        } else {
          this.getClientInfo(cli).userInfo = { name: message.name };
          this.getClientInfo(cli).chat = true;
          this.sendUsersInfoToClients();
          cli.send({ type: 'enter_chat' });
        }
      } else {
        cli.send({ type: 'user_info_error', message: 'Informe o nome do usuário.' });
      }
    }

    onMessageText (cli: IChatClient, message: any): void {
      const cliUsername = this.getClientInfo(cli)?.userInfo?.name;
      if (message.text && typeof message.text === 'string') {
        let c: IChatClient;
        for (c of this.#clients) {
          const info = this.getClientInfo(c);
          if (info?.chat) {
            const messageToSend: any = {
              type: 'text_message',
              text: message.text,
              username: cliUsername,
              datetime: new Date(),
              your: false
            };
            if (c.id === cli.id) {
              messageToSend.id = message.id;
              messageToSend.your = true;
            }
            c.send(messageToSend);
          }
        }
      }
    }

    sendUsersInfoToClients () {
      const usersInfo = this.getUsersInfo();
      for (const cli of this.#clients) {
        const usersInfoToThisClient = usersInfo.map(u => ({ ...u, your: u.id === cli.id }));
        cli.send({ type: 'users_info', users: usersInfoToThisClient });
      }
    }

    checkUsernameAlreadyExists (username: string) {
      return [...this.#clientInfos.values()].some(i => i.userInfo?.name === username);
    }

    getUsersInfo (): any[] {
      return [...this.#clientInfos.values()]
        .filter(i => i.chat)
        .map(i => ({ id: i.client?.id, ...i.userInfo! }));
    }

    getClientInfo (cli: IChatClient): ChatClientInfo {
      const info = this.#clientInfos.get(cli.id);
      if (info) {
        return info;
      } else {
        throw new ChatClientInfoNotFoundException(cli.id);
      }
    }

    private getType (message: any): string {
      return message?.type || '';
    }
}
