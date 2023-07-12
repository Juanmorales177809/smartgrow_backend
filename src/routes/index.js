const express = require('express');

const actuadoresRouter = require('./actuadoresRouter');
const setPointRouter = require('./setPointRouter');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/rele', actuadoresRouter);
    router.use('/set-point', setPointRouter)
}

module.exports = routerApi;