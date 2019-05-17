const express = require('express');
const socket = require('socket.io');
const app = express();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
const io = socket(server);

app.get('/', (req, res) => {
    res.send('Hello World');
});

let text = '';

io.sockets.on('connection', (ss) => {
    console.log('a new user with id ' + ss.id + ' has entered');
    ss.emit('newUser', text);

    ss.on('mess', (val) => {
        text = val;
        ss.broadcast.emit('text', val);
    });
});
