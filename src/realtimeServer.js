module.exports = httpServer => {
    const { Server } = require('socket.io');
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    });

    io.on('connection', socket => {
        socket.on('message', message => {
            console.log(message);
        });
    });
    return io;
}
