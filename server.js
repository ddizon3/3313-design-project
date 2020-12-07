//setup server requirements
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(express.urlencoded( {extended: true} ));

const rooms = { }

// index page
app.get('/', function  (req, res) {
    res.render('index.ejs');
});

//directs user to a chatroom
app.post('/api/room', (req, res) => {
    let { name } = req.body;
    if(rooms[name] != null){
        return res.redirect('/chat/'.concat(name));
    }
    else {
        rooms[name] = { users: {} }
        return res.redirect('/chat/'.concat(name));
    }
});

//chat page
app.get('/chat/:room', function(req, res) {
    if(rooms[req.params.room] == null) {
       return res.redirect('/')
    }
    res.render('chat.ejs', {room: req.params.room});
});

const server = http.listen(3000, function () {
    console.log('listening on *:3000');
});

//MIDDLEWARE
//connect users to a room by room name
io.sockets.on('connection', (socket) => {
    socket.on('new-user', (room, name) => {
        socket.join(room);
        if (!rooms[room]) rooms[room] = {users: {}};
        rooms[room].users[socket.id] = name;
        socket.to(room).broadcast.emit('user-connected', name + ' has joined the chatroom');
    })

    //disconnect the users from the room
    socket.on('disconnect', () => {
        for(const room in rooms) {
            if (rooms[room].users[socket.id]) {
                const name = rooms[room].users[socket.id];
                socket.to(room).broadcast.emit('user-disconnected', name + ' has left the chatroom');
                delete rooms[room].users[socket.id];
                
                //if the room now has 0 users, delete room
                if(Object.keys(rooms[room].users).length === 0) {
                    delete rooms[room];
                    console.log("ROOM HAS BEEN DELETED");
                }
            }
        }
    })

    //emit message to all users in the chatroom
    socket.on('send_chat_message', (room, message) => {
        io.in(room).emit('chat_message', { message: message, name: rooms[room].users[socket.id] });
    })
});