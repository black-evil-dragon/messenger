import io from 'socket.io-client';
import proxy from '../../package.json'

const socket = io(proxy.proxy, {
    'autoConnect': false,
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10,

    query: {}
});

const ErrorHandle = error => {
    console.warn(error)
}

socket.on('connect_error', reason => ErrorHandle({
    status: 500,
    code: 'connect_error',
    reason
}))

socket.on('disconnect', reason => ErrorHandle({
    status: 500,
    code: 'disconnect',
    reason
}))

socket.on('connect_failed', reason => ErrorHandle({
    status: 500,
    code: 'connect_failed',
    reason
}))

socket.on('auth_error', reason => ErrorHandle({
    status: 500,
    code: 'auth_error',
    reason
}))

export default socket