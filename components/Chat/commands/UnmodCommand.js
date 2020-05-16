import Command from './Command';
export default class UnmodCommand extends Command {
    run(args) {
        if(!this.hasPrivilege) return;
        // Just do this check server-side instead
        /*if(
            this.me
            && this.channel.data.user.name !== this.me.name
        ){
            return;
        }*/
        if(args && args[0]){
            let user = this.users.get(args[0]);
            this.socket.emit('unmod', user && user.id);
        }
    }
}