import Command from './Command';
export default class UsersCommand extends Command {
    run() {
        let nicks = [];
		[...this.users].forEach((args) => {
			let user = args[1];
    		if(user && user.name) nicks.push(user.name);
        });
        this.socket.emit('sys', 'User list: ' + nicks.join(' '));
    }
}