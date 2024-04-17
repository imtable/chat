var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo');
require('dotenv').config()

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// ************************** MLG PRO ELITE CODE **********************



var debug = require('debug')('exprs:server');
var http = require('http');

const sio = require('socket.io');

const runSockets = (server) => {
   const io = sio(server);

   io.on('connection', (socket) => {
      console.log(`Connection ID: ${socket.id}`);
      
      socket.on('msgReq', (data, cb) => {
         console.log(data);
         // cb('msg received');
         io.emit('msgRes', {userName: data.userName, msg: data.msg});
      });

      socket.on('typingReq', (data) => {
         io.emit('typingRes', data );
      });

      socket.on('disconnect', () => {
         console.log(`Disconnection ID: ${socket.id}`);
      });
   });
};

const httpPort = process.env.PORT;

const runHttp = () => {
    var port = httpPort;
   app.set('port', port);

   /**
    * Create HTTP server.
    */

   var server = http.createServer(app);

   /**
    * Listen on provided port, on all network interfaces.
    */

   server.listen(port);
   server.on('error', onError);
   server.on('listening', onListening);

   /**
    * Event listener for HTTP server "error" event.
    */

   function onError(error) {
   if (error.syscall !== 'listen') {
   throw error;
   }

   var bind = typeof port === 'string'
   ? 'Pipe ' + port
   : 'Port ' + port;

   // handle specific listen errors with friendly messages
   switch (error.code) {
   case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
   case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
   default:
      throw error;
   }
   }

   /**
    * Event listener for HTTP server "listening" event.
    */

   function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
   ? 'pipe ' + addr
   : 'port ' + addr.port;
   debug('Listening on ' + bind);
   }
   return server;
};

  const mongoose = require('mongoose');
const db = require('../storage/db');

// const { dbUri, options } = require('../config/db');
// const dbUri = 'mongodb+srv://imtable:adaD1324@petprojectscluster.khgowa0.mongodb.net/?retryWrites=true&w=majority&appName=petProjectsCluster';
// mongodb+srv://imtable:adaD1324@petprojectscluster.khgowa0.mongodb.net/?retryWrites=true&w=majority&appName=petProjectsCluster
//   const options = {
   //    //  useNewUrlParser: true,
   //    //  useUnifiedTopology: true,
   //    //  useCreateIndex: false,
   //    //  useFindAndModify: false
   //   }

// const dbUri = 'mongodb+srv://imtable:adaD1324@petprojectscluster.khgowa0.mongodb.net/?retryWrites=true&w=majority&appName=petProjectsCluster';
   const dbUri = process.env.MONGODB_URI;

const dbRunner = () => new Promise((resolve, reject) => {
   mongoose.connect(dbUri);
   
   db.on('error', (err) => {
      console.log('DB err');
      // log.info('BD ERR:', err);
   });
   db.once('open', () => {
      console.log('Connected to DB');
      // log.info('Connected to DB');
      resolve();
   });
   db.once('close', () => {
      console.log('Close connection to DB');
      // log.info('Close connection to DB');
   });
});



const run = () => new Promise(async (resolve, reject) => {
// const run = async () => {
   await dbRunner();
   const server = runHttp();
   await runSockets(server);
// }
})

run()
// ************************** MLG PRO ELITE CODE **********************

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

const { uri } = require('../config').db;

app.use(session({
  secret: 'poijklmnb',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: uri,
  })
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;