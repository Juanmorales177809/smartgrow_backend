const express = require('express');
const { createServer } = require('http');
const realtimeServer = require('./realtimeServer');
const path = require('path');

const app = express();
const httpServer = createServer(app);

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({'title': 'Hello World'})
});

app.get('/prueba', (req, res) =>{
    io.emit('message', {sensor: 'sensor1', value: '20'});
    res.json({'title': 'Hello World'})
});

app.get('/prueba2', (req, res) =>{
    io.emit('message', {sensor: 'sensor2', value: '30'});
    res.json({'title': 'Hello World'})
});

httpServer.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

io = realtimeServer(httpServer);