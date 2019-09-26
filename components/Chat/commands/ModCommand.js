import Command from './Command';
export default class ModCommand extends Command {
    run(args) {
        if(!this.hasPrivilege) return;
        if(
            this.me
            && this.channel.data.user.name !== this.me.name
        ){
            return;
        }
        if(args && args[0]){
            let user = this.users.get(args[0]);
            this.socket.emit('mod', user && user.id);
        }
    }
}