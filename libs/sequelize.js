const {Sequelize} = require('sequelize');

const setupModels  = require('../database/models');

const  sequelize = new Sequelize('smartgrow', 'smartgrow', 'admin1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true,
});

setupModels(sequelize);

sequelize.sync();

module.exports = sequelize;
