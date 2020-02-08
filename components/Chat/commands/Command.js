export default class Command {
    constructor(socket, channel, me, token, hasPrivilege, users) {
        this.socket = socket;
        this.channel = channel;
        this.me = me;
        this.token = token;
        this.hasPrivilege = hasPrivilege;
        this.users = users;
    }
}