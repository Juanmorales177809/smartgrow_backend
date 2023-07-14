class ActuadoresService{
    constructor(){};

    async activation(rele, clientMqtt, timeRecirculacion = 30000){
        if (rele == 'entrada_de_agua_hidroponico' || rele == 'desague_hidroponico'){
            clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
        } else {
            clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
            setTimeout(() => {
                clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
            },timeRecirculacion);
        }
    }
}

module.exports = ActuadoresService;