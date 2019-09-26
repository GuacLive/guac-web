import ModCommand from './commands/ModCommand';
import UnmodCommand from './commands/UnmodCommand';
import BanCommand from './commands/BanCommand';
import UnbanCommand from './commands/UnbanCommand';
import UsersCommand from './commands/UsersCommand';
import TimeoutCommand from './commands/TimeoutCommand';

let commands = new Map();
commands.set('mod', ModCommand);
commands.set('unmod', UnmodCommand);
commands.set('ban', BanCommand);
commands.set('unban', UnbanCommand);
commands.set('users', UsersCommand);
commands.set('timeout', TimeoutCommand);

export default commands;