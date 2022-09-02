import io from 'socket.io-client';
import proxy from '../../package.json'

const socket = io(proxy.proxy, {
    'autoConnect': false,
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10,

    query: {}
});


export default socket