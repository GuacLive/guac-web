import Command from './Command';
import { useSelector } from 'react-redux';
export default class ReconnectCommand extends Command {
    run(args) {
        this.socket.emit('disconnect');
        this.socket.disconnect();
        this.socket.connect();
        this.socket.emit('join', this.token);
    }
}