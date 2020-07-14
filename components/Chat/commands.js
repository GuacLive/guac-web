import ModCommand from './commands/ModCommand';
import UnmodCommand from './commands/UnmodCommand';
import BanCommand from './commands/BanCommand';
import UnbanCommand from './commands/UnbanCommand';
import UsersCommand from './commands/UsersCommand';
import TimeoutCommand from './commands/TimeoutCommand';
import ReconnectCommand from './commands/ReconnectCommand';

let commands = new Map();
commands.set('mod', {
	'usage': '[username]',
	'description': 'Grant moderator status to a user',
	'func': ModCommand
});
commands.set('unmod', {
	'usage': '[username]',
	'description': 'Revoke moderator status from a user',
	'func': UnmodCommand
});
commands.set('ban', {
	'usage': '[username]',
	'description': 'Permanently ban a user from Chat',
	'func': BanCommand
});
commands.set('unban', {
	'usage': '[username]',
	'description': 'Remove a timeout or a permanent ban on a user',
	'func': UnbanCommand
});
commands.set('users', {
	'usage': '',
	'description': 'Display users in a channel',
	'func': UsersCommand
});
commands.set('timeout', {
	'usage': '[username] [duration]',
	'description': 'Temporarily ban a user from Chat',
	'func': TimeoutCommand
});
commands.set('reconnect', {
	'usage': '',
	'description': 'Reconnect to Chat Server',
	'func': ReconnectCommand
});

export default commands;