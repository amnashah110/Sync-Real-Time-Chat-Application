require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const http = require('http');
const socketIo = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const authRoutes = require('./auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const store = MongoStore.create({ mongoUrl: process.env.MONGO_URI });

app.use(cookieParser());
app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    key: 'express.sid',
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

io.use(
    passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'express.sid',
        secret: process.env.SECRET,
        store: store,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    })
);

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;

app.set('view engine', 'pug');
app.set('views', './pages');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', routes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error('An error occurred:', err); // Log the error
    res.status(500).send('Something broke!');
});

let currentUsers = 0;

io.on('connection', (socket) => {
    const user = socket.request.user;
    const username = user ? user.username : 'Anonymous';

    console.log(`User connected: ${username}`);
    
    ++currentUsers;
    io.emit('user', {
        username,
        currentUsers,
        connected: true
    });

    socket.on('chat message', (message) => {
        io.emit('chat message', { username, message });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${username}`);
        --currentUsers;
        io.emit('user', {
            username,
            currentUsers,
            connected: false
        });
    });
});

function onAuthorizeSuccess(data, accept) {
    console.log('Successful connection to socket.io');
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        console.error('Socket.io authorization failed:', error); // Log the error
        accept(null, false);
    } else {
        console.log('Failed connection to socket.io:', message);
        accept(null, false);
    }
}

mongoose.connect(URI)
    .then(() => {
        console.log('App connected to database');
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
