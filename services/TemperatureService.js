const {InfluxDB, flux, FluxTableMetaData} = require('@influxdata/influxdb-client')
const {models} = require('../libs/sequelize');
const mqtt = require('mqtt');

class TemperatureService {
  constructor(url, token, org, brockerUrl) {
    this.client = new InfluxDB({ url, token });
    this.queryApi = this.client.getQueryApi(org);
    //this.client = mqtt.connect(brockerUrl)
  }

  getLastData(callback) {
      const query = flux`from(bucket:"iotsmart")\
      |> range(start: 0)\
      |> filter(fn:(r) => r._measurement == "my_measurement")\
      |> filter(fn:(r) => r.location == "chamber_1")\
      |> filter(fn:(r) => r._field == "temperature")\
      |> last()`;

      const resultados = [];

      this.queryApi.queryRows(query, {
        next(row, tableMeta) {
            const o = tableMeta.toObject(row)
            console.log(`${o._time} ${o._measurement}: ${o._field}=${o._value}`);
            console.log(o._value);
            resultados.push(o);
        },
        error(error) {
            console.error(error);
            console.log('Finished ERROR')
            callback(error);
        },
        complete() {
            console.log('Finished SUCCESS')
            callback(resultados)
        },
    });
  }

  // modificarSetPoint(setpoint, callback) {
  //   console.log(setpoint);
  //   this.client.publish('setpoint', setpoint.toString());
  //   callback();
  // }
  async getSetPoint(valor){
    const setpoint = await this.findOne({
      where: {setpoint: valor}}).then(setpoint => {
        return setpoint;
      })
  }

  async modificarSetPoint(id, changes) {
    const setpoint = await this.findOne(id);
    const rta = await setpoint.update(changes);
    return rta;
  }

  async update(id,changes){const user=await this.findOne(id);const rta=await user.update(changes);return rta;}

  async createSubscription(callback) {
    try {
      const query = `
      from(bucket: "iotsmart")
        |> filter(fn:(r) => r._measurement == "my_measurement")\
        |> filter(fn:(r) => r.location == "chamber_1")\
        |> filter(fn:(r) => r._field == "temperature")
      `;
      const subscription = await this.client.createStreamQuery({ query });
      subscription.subscribe((result) => {
        if (result instanceof FluxTableMetaData){
          //Manejo de datos
        } else {
          console.log('Nueva actualizacion: ', result);
        }
      });
      callback();
    } catch (error){
      console.error('Error al gestionar la suscripcion: ', error);
    }
  }
}

module.exports = TemperatureService;
