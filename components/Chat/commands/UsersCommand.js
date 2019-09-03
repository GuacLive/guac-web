import Command from './Command';
export default class UsersCommand extends Command {
    run() {
        let nicks = [];
        console.log(this);
		[...this.users].forEach((args) => {
			let user = args[1];
    		if(user && user.name) nicks.push(user.name);
        });
        // MAJOR HACK (until i modularize the chat a bit more)
        this.socket._callbacks.$sys[0]('User list: ' + nicks.join(' '));
    }
}