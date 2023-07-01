const express = require('express');
const router = express.Router();
const path = require('path');
const MqttClient = require('../ mqttClient');

router.get('/', (req, res) => {
    res.json({'title': 'Hello World'})
});

router.get('/st_hidroponic_ec/:st', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_ec', st);
});

router.get('/st_hidroponic_temperatura', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_temperatura', st);
    // Se envia el dato al ESP
});

router.get('/st_hidroponic_ph', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_ph', st);
    // Se envia el dato al ESP
});

router.get('/rele', async (req, res) =>{
    try {
        const { rele } = req.query;
        clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
        res.json({'rele': rele})
      } catch (error) {
        console.log(error);
      }
});

module.exports = router;