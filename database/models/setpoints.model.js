const {Model, DataTypes, Sequelize} = require('sequelize');

const SETPOINT_TABLE = 'setpoint';

const setPointSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  set_point: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  set_point_value: {
    allowNull: false,
    type: DataTypes.FLOAT,
  }
};

class SetPoint extends Model {
  static associate(models) {
    // define association here
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: SETPOINT_TABLE,
      modelName: 'SetPoint',
      timestamps: false,
    };
  }
}

module.exports = {SETPOINT_TABLE,setPointSchema, SetPoint};
