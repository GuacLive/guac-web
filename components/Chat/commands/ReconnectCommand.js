import Command from './Command';
import { useSelector } from 'react-redux';
export default class ReconnectCommand extends Command {
    run(args) {
        const authentication = useSelector(state => state.authentication);
        this.socket.emit('join', authentication.token);
    }
}