const express = require('express');

const temperatureRouter = require('./TemperatureRouter');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/temperature', temperatureRouter);
}

module.exports = routerApi;
