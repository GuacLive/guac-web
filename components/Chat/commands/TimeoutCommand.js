import Command from './Command';
export default class TimeoutCommand extends Command {
    run(args) {
        if(!this.hasPrivilege) return;
		if(args && args[0]){
			let user = this.users.get(args[0]);
			let time = typeof args[1] === 'number' ? args[1] : 600;
			this.socket.emit('timeout', user && user.id, time);
		}
    }
}