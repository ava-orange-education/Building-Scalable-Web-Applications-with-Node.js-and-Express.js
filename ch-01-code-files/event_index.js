const events = require('events');

// Initiate an EventEmitter object
const eventEmitter = new events.EventEmitter();

// Binds event handler for send message
eventEmitter.on('send_message', function () {
    console.log('Hi, This is my first message');
});

// Handler associated with the connection event
const connectHandler = function connected() {
    console.log('Connection is created');
    // Trigger the corresponding event
    eventEmitter.emit('send_message');
};

// Binds the event with handler
eventEmitter.on('connection', connectHandler);

// Trigger the connection event
eventEmitter.emit('connection');


console.log("Finish");
