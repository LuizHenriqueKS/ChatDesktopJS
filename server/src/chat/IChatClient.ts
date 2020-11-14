interface IChatClient {

    readonly id: number;
    send(message: any): void;
    close(): void;

}

export default IChatClient;
