const express = require('express');
const TemperatureService = require('../services/TemperatureService');

const router = express.Router();

const url = 'http://172.16.20.104:8086';
const token = '4gXnc_rJb3t5DO_cY2VKINwWSq8SRAPfFqN9AQpw8A5uoOkl-ihhQVZqJshzyUSn6xtymG2z-J6_MiQdeXsdEQ=='
const org = 'smartgrow'
const brokerUrl = 'mqtt://localhost:1883';

const service =  new TemperatureService(url, token, org);

router.get('/', (req,res) =>{
  service.getLastData((data) => {
    res.send(data);
  });
});

// router.post('/setpoint', (req,res) =>{
//   const setpoint = req.body.setpoint;
//   console.log(setpoint);
//   service.modificarSetPoint(setpoint, () => {
//     res.send('Mensaje enviado al broker MQTT');
//   });
// });

router.get('/subscription', (req,res) =>{
  service.createSubscription(() => {
    res.status(200).send('Suscripcion creada');
  });
});

router.get('/setpoint', async (req,res) =>{
  const setpoint = await service.getSetPoint('Temperatura');
  res.json(setpoint)
});

router.patch('/setpoint/:id', async (req,res) =>{
  const { id } = req.params;
  const body = req.body;
  const setpoint = await service.modificarSetPoint(id, body);
  res.json(setpoint)
});


module.exports = router;

