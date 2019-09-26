import Command from './Command';
export default class BanCommand extends Command {
    run(args) {
        if(!this.hasPrivilege) return;
        if(args && args[0]){
            let user = this.users.get(args[0]);
            this.socket.emit('ban', user && user.id);
        }
    }
}