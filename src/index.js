const express = require('express');
const { createServer } = require('http');
const realtimeServer = require('./realtimeServer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

app.use(cors());
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

app.post('/st_hidroponic_ec', (req, res) =>{
    const st = req.body.st;
    // Se envia el dato al ESP
});

app.post('/st_hidroponic_temperatura', (req, res) =>{
    const st = req.body.st;
    // Se envia el dato al ESP
});

app.post('/st_hidroponic_ph', (req, res) =>{
    const st = req.body.st;
    // Se envia el dato al ESP
});

app.post('/sensores_de_flujo', (req, res) =>{
    const flujo_1 = req.body.flujo_1;
    const flujo_2 = req.body.flujo_2;
    const flujo_3 = req.body.flujo_3;
    const litros_1 = req.body.litros_1;
    const litros_2 = req.body.litros_2;
    const litros_3 = req.body.litros_3;
    const temperatura_agua1 = req.body.temperatura_agua1;
    const temperatura_agua2 = req.body.temperatura_agua2;
    const temperatura_agua3 = req.body.temperatura_agua3;
    console.log(flujo_1, flujo_2, flujo_3, litros_1, litros_2, litros_3, temperatura_agua1, temperatura_agua2, temperatura_agua3);
    res.status(200).json({message: 'recibido'});
});

app.get('/rele', async (req, res) =>{
    try {
        const response = await fetch("http://10.220.85.101/api?rele=rele1_pin1");
        const data = await response.json();
        console.log(data);
        res.json(data)
      } catch (error) {
        console.log(error);
      }
});

httpServer.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

io = realtimeServer(httpServer);