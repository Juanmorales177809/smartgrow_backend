const express = require('express');
const { createServer } = require('http');
const realtimeServer = require('./realtimeServer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const httpServer = createServer(app);

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({'title': 'Hello World'})
});

app.post('/scd40', (req, res) =>{
    console.log(req.body);
    const Co2 = req.body.co2;
    const temperatura = req.body.temperatura;
    const humedad = req.body.humedad;
    console.log(Co2, temperatura, humedad);
    io.emit('message', {sensor: 'scd40', Co2: Co2, temperatura: temperatura, humedad: humedad});
    res.status(200).json({message: 'recibido'})
});

app.post('/hidroponico', (req, res) =>{
    const ph = req.body.ph;
    const ec = req.body.ec;
    const temperatura = req.body.temperatura;
    const humedad = req.body.humedad;
    io.emit('message', {sensor: 'hidroponico', ph: ph, ec: ec, temperatura: temperatura, humedad: humedad});
    res.status(200).json({message: 'recibido'})
});

httpServer.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

io = realtimeServer(httpServer);