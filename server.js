const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

const addMovieRoutes = require('./routes/movie-route')
const addReviewRoutes = require('./routes/review-route')
const addUserRoutes = require('./routes/user-route')

app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true // enable set cookie
}));
app.use(bodyParser.json())
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
  secret: 'omer natalia',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var historyMsgs = [];
var connectedSockets = [];

io.on('connection', function (socket) {

  console.log('coooonect');

	socket.on('roomRequested', ({topic, user}) => {
		
		if (socket.theTopic) {
			// First un-join the room
			socket.leave(socket.theTopic);
		}
		console.log('User', user, 'Requested to join room:', topic);
		socket.join(topic);
		socket.to(topic).emit('userConnected', user);
		socket.theTopic = topic; 
	});

	socket.on('post-msg', msg => {

		console.log('Posting a message', msg, 'to:', socket.theTopic);
		// socket.to - send to everyone in the room except the sender
		socket.to(socket.theTopic).emit('msg-recived', msg);
		// socket.broadcast(socket.theTopic).emit('msg-recived', msg);
		// socket.in(socket.theTopic).emit('msg-recived', msg);

		// setTimeout(()=>{
		// 	socket.emit('msg-recived', {txt: 'Hii everyone!',from: 'Natalia'},);
		// }, 1500)
		// setTimeout(()=>{
    //   socket.emit('msg-recived', {txt: 'Hello Natalia, you know I\'ve seen this movie five times, it\'s just perfect',
    //   from: 'Olga'},);
    // }, 4000)
    // setTimeout(()=>{
		// 	socket.emit('msg-recived', {txt: 'No way! You\'re crazy',from: 'Natalia'},);
		// }, 6000)
		
  });
  // -------------------------------------

  console.log('a user connected');
  connectedSockets.push(socket);
  
  socket.on('check', boogabooga => {
    console.log('connection was good', boogabooga)
  })
  
  // socket.on('disconnect', function () {
  //   console.log('user disconnectedddddddd',socket.nickName);
  //   socket.broadcast.emit('user disconnected',socket.nickName);
  //   connectedSockets = connectedSockets.filter(s => s.nickName !== socket.nickName)  
  // });

  // socket.on('chat joined', nickName=>{
  //     socket.emit('chat historyMsgs', historyMsgs);
  //     socket.broadcast.emit('chat newUser',nickName);
  //     socket.nickName = nickName;
  //     console.log('i have a name', socket.nickName)
  //     console.log('connectedSockets: ', connectedSockets.length);
  // });

  socket.on('chat msgToSend', (msg) => {
    console.log('msggggggggggg',msg)
      if (msg.txt.startsWith('to:')) {
          var to = msg.txt.substring(3, msg.txt.indexOf(';'));
          console.log('Sending to', to);
          var targetSocket = connectedSockets.find(s => s.nickName === to);
          socket.emit('chat newMsg', msg);
          targetSocket.emit('chat newMsg', msg);
      } else {
          io.emit('chat newMsg', msg);
          historyMsgs.push(msg);
      }
      // console.log('sending msg: ' + msg, 'to:', connectedCount + 'users');
  });
});

addMovieRoutes(app)
addReviewRoutes(app)
addUserRoutes(app)

const port = process.env.PORT || 3003;

// app.listen(port, () => console.log(`Example app listening on port ${port}`))
http.listen(port, function () {
  console.log(`listening on *:${port}`);
});