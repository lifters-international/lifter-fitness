const { io } = require("socket.io-client");
const { getServerUrl } = require("./urls");

const socketTrainerClientEvent = {
    ChangeClientsOrder: () => {},
    authenticated: () => {},
    NewMessage: () => {},
    newClientPending: () => {}
}

const trainerClientSocket = io(getServerUrl()+"trainersClient");

trainerClientSocket.onAny( (event, arg ) => {
    try {
        socketTrainerClientEvent[event](arg);
    }catch(err) {
        console.log(err);
    }
});

module.exports = {

    // Trainer Client Socket Events

    trainerClientAuthenticate: ( token ) => {
        trainerClientSocket.emit("authenticate", { token });
    },

    onTrainerClient: ( event, callback ) => {
        socketTrainerClientEvent[event] = callback;
    },

    trainerClientEmit: ( event, args ) => {
        trainerClientSocket.emit( event, args)
    }
};

