const { json } = require('express');
const mqtt = require('mqtt');

module.exports = (brokerUrl, topic) => {
    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe(topic);
    });

    client.on('message', (topic, message) => {
        console.log(`Message received on topic: ${topic}`);
        console.log(`Message content: ${message.toString()}`);
        if (topic == 'smartgrow/hidroponico/actuadores') {
            console.log(`${message.toString()}`);
            // Aca se podrian enviar los datos de los actuadores a una BD
        } else if (topic == 'smartgrow/hidroponico/sensores') {
            const jsonMessage = JSON.parse(message.toString());
            console.log(jsonMessage);
            io.emit('message', jsonMessage);
            // Aca se podrian enviar los datos de los sensores a una BD
        }
    });

    client.on('error', (error) => {
        console.log(`Error: ${error}`);
        client.end();
    });
    return client;
}