const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.json({ test: 'Hello World' });
});

let editorInfo = {
    text: '',
    runClicked: false,
};
let counter = 0;

io.sockets.on('connection', (socket) => {
    console.log('a new user with id ' + socket.id + ' has entered');
    socket.emit('newUser', editorInfo);

    socket.on('mess', (val) => {
        editorInfo.text = val;
        console.log(Object.keys(socket.rooms)[1]);
        socket.to(Object.keys(socket.rooms)[1]).broadcast.emit('text', val);
    });

    socket.on('run', val => {
        console.log(Object.keys(socket.rooms)[1]);
        socket.to(Object.keys(socket.rooms)[1]).broadcast.emit('run', val);
        console.log('runed', ++counter);
    });

    socket.on('createRoom', room => {
        socket.join(room);
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
