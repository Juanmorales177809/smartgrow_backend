const express = require('express');
const router = express.Router();
const actuadoresService = require('../services/actuadores.service');

const service = new actuadoresService();

router.get('/', async (req, res) =>{
    try {
        const { rele, tiempo_recirculacion} = req.query;
        console.log(tiempo_recirculacion);
        await service.activation(rele, clientMqtt, tiempo_recirculacion);
        res.json({'rele': rele})
      } catch (error) {
        console.log(error);
      }
});

module.exports = router;