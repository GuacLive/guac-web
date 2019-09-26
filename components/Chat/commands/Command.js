export default class Command {
    constructor(socket, channel, me, hasPrivilege, users) {
        this.socket = socket;
        this.channel = channel;
        this.me = me;
        this.hasPrivilege = hasPrivilege;
        this.users = users;
    }
}