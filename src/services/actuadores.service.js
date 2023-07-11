class ActuadoresService{
    constructor(){};

    async activation(rele, clientMqtt){
        if (rele == 'entrada_de_agua'){
            clientMqtt.publish('smartgrow/hidroponico/actuadores', rele);
        }
    }

}

module.exports = ActuadoresService;