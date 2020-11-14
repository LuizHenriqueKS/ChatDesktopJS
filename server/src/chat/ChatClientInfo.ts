
import IChatClient from './IChatClient';
import UserInfo from './UserInfo';

export default class ChatClientInfo {
    client?: IChatClient;
    userInfo?: UserInfo;
    authenticated: Boolean = false;
    chat: Boolean = false;
};
