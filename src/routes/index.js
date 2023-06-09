const express = require('express');
const router = express.Router();
const path = require('path');
const { enviarMensaje } = require('../realtimeServer');
const { env } = require('process');


const views = path.join(__dirname, '/../views');

router.get('/', (req, res) => {
    res.json({'title': 'Hello World'})
});

router.get('/prueba', (req, res) =>{
    enviarMensaje('Hola desde el servidor');
})

module.exports = router;