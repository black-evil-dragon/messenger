import io from 'socket.io-client';
import proxy from '../../package.json'

const socket = io(proxy.proxy);

export default socket