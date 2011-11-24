var http = require('http').createServer()
  , io = require('socket.io').listen(http);

http.on('request', function (req, res) {
  var body = ['<script src="/socket.io/socket.io.js"></script>\n'
    , '<div id="output"></div><script>\n'
    , 'var socket = io.connect();\n'
    , 'function log() {'
    , 'document.getElementById("output").innerHTML += "<p>" + io.JSON.stringify(arguments) + "</p>";'
    , '}'
    , 'socket.on("connect", function(){ log("connect") });\n'
    , 'socket.on("message", function(){ log("message", arguments) });\n'
    , 'socket.on("disconnect", function(){ log("disconnect") });\n'
    , 'socket.on("error", function(){ log("error", arguments) });\n'
    , 'socket.on("event", function(){ log("event", arguments) });\n'
    , 'socket.on("connect_failed", function(){ log("connect_failed", arguments) });\n'
    , 'socket.on("reconnect_failed", function(){ log("reconnect_failed", arguments) });\n'
    , 'socket.on("reconnecting", function(){ log("reconnecting", arguments) });\n'
    , 'socket.on("reconnect", function(){ log("reconnect", arguments) });\n'

    , 'var namespace = socket.of("/namespace");\n'
    , 'namespace.on("connect", function(){ log("connect namespace") });\n'
    , 'namespace.on("message", function(){ log("message namespace", arguments) });\n'
    , 'namespace.on("disconnect", function(){ log("disconnect namespace") });\n'
    , 'namespace.on("error", function(){ log("error namespace", arguments) });\n'
    , 'namespace.on("event", function(){ log("event namespace", arguments) });\n'
    , 'namespace.on("connect_failed", function(){ log("connect_failed namespace", arguments) });\n'
    , 'namespace.on("reconnect_failed", function(){ log("reconnect_failed namespace", arguments) });\n'
    , 'namespace.on("reconnecting", function(){ log("reconnecting namespace", arguments) });\n'
    , 'namespace.on("reconnect", function(){ log("reconnect namespace", arguments) });\n'
    , '</script>\n'
  ].join('');

  res.writeHead(200, {
      'Content-Type': 'text/html'
    , 'Content-Length': Buffer.byteLength(body)
  });

  res.end(body);
});

io.sockets.on('connection', function (socket) {
  console.log('connection');

  socket.send('pew');
  socket.emit('event', { hello:'world' });

  socket.on('disconnect', function () {
    console.log('disconnected');
  });
});

io.of('/namespace').on('connection', function (socket) {
  console.log('connection namespace');

  socket.send('pew');
  socket.emit('event', { hello:'world' });

  socket.on('disconnect', function () {
    console.log('disconnected namespace');
  });
});

http.listen(3000);
console.log('listening on http://localhost:3000');
