module.exports = httpServer => {
    const { Server } = require('socket.io');
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });

    io.on('connection', socket => {
        console.log(socket.id);
        socket.on('message', message => {
            console.log(message);
        });
    });
    return io;
}
