const { Client } = require('pg');

async function getConnection(){
    const client = new Client({
        user: 'smartgrow',
        host: 'localhost',
        database: 'smartgrow',
        password: 'admin1234',
        port: 5432
      });
      await client.connect();
      return client;
}

module.exports = getConnection;
