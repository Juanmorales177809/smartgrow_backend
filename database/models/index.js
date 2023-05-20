const {SetPoint, setPointSchema}  = require('./setpoints.model')

function setuptModels(sequelize){
  SetPoint.init(setPointSchema, SetPoint.config(sequelize));
}

module.exports = setuptModels;
