export class ChatClientInfoNotFoundException {
    clientId: number;

    constructor (clientId:number) {
      this.clientId = clientId;
    }
}
