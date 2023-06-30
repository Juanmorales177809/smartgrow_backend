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
        const jsonMessage = JSON.parse(message.toString());
        console.log(jsonMessage);
        io.emit('message', jsonMessage);
    });

    client.on('error', (error) => {
        console.log(`Error: ${error}`);
        client.end();
    });
    return client;
}