const express = require('express');
const router = express.Router();
const path = require('path');
const MqttClient = require('../ mqttClient');

router.get('/', (req, res) => {
    res.json({'title': 'Hello World'})
});

router.post('/st_hidroponic_ec', (req, res) =>{
    const st = req.body.st;
    clientMqtt.publish('smartgrow/st_hidroponic_ec', st);
    // Se envia el dato al ESP
});

router.post('/st_hidroponic_temperatura', (req, res) =>{
    const st = req.body.st;
    clientMqtt.publish('smartgrow/st_hidroponic_temperatura', st);
    // Se envia el dato al ESP
});

router.post('/st_hidroponic_ph', (req, res) =>{
    const st = req.body.st;
    clientMqtt.publish('smartgrow/st_hidroponic_ph', st);
    // Se envia el dato al ESP
});

router.post('/sensores_de_flujo', (req, res) =>{
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

router.get('/rele', async (req, res) =>{
    try {
        const response = await fetch("http://10.220.85.101/api?rele=rele1_pin1");
        const data = await response.json();
        console.log(data);
        res.json(data)
      } catch (error) {
        console.log(error);
      }
});
module.exports = router;