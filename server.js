/*
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  fs.createReadStream('index.html').pipe(res);
})

server.listen(process.env.PORT || 3000);
*/

var static = require('node-static');
var http = require('http');

var file = new(static.Server)(__dirname);

http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(3000);