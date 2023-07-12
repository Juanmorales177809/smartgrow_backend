class ActuadoresService{
    constructor(){};

    async activation(rele, clientMqtt){
        if (rele == 'entrada_de_agua' || rele == 'desague_hidroponico'){
            clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
        } else {
            clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
            setTimeout(() => {
                clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
            },30000);
        }
    }


}

module.exports = ActuadoresService;