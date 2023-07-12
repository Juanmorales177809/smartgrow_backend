const express = require('express');
const router = express.Router();

router.get('/hidroponic_ec/:st', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_ec', st);
});

router.get('/hidroponic_temperatura', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_temperatura', st);
    // Se envia el dato al ESP
});

router.get('/hidroponic_ph', (req, res) =>{
    const { st } = req.params;
    clientMqtt.publish('smartgrow/st_hidroponic_ph', st);
    // Se envia el dato al ESP
});

module.exports = router;