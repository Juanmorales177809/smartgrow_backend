const {InfluxDB, flux} = require('@influxdata/influxdb-client')
const mqtt = require('mqtt');

class TemperatureService {

    constructor(url, token, org, brockerUrl) {
      this.client = new InfluxDB({ url, token });
      this.queryApi = this.client.getQueryApi(org);
      this.client = mqtt.connect(brockerUrl)
    }

    getData(callback) {
      const query = flux`from(bucket:"iotsmart")\
      |> range(start: -72h)\
      |> filter(fn:(r) => r._measurement == "my_measurement")\
      |> filter(fn:(r) => r.location == "chamber_1")\
      |> filter(fn:(r) => r._field == "temperature")\
      |> aggregateWindow(every: 24h, fn: max, createEmpty: false,)\
      |> yield(name:"max")`

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

  modificarSetPoint(setpoint, callback) {
    console.log(setpoint);
    this.client.publish('setpoint', setpoint.toString());
    callback();

  }
}

module.exports = TemperatureService;
