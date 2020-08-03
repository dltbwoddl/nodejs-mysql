var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var db = require("./lib/db")
var topic = require("./lib/topic")
var author = require("./lib/author")
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.page(response, queryData);
    }
  } else if (pathname === '/create') {
    console.log(9);
    topic.create(response);
    console.log(10);
  } else if (pathname === '/create_process') {
    topic.create_update(request, response);
  } else if (pathname === '/update') {
    topic.update(response, queryData);
  } else if (pathname === '/update_process') {
    topic.update_process(request, response);
  } else if (pathname === '/delete_process') {
    topic.delete(request, response);
  } else if (pathname === '/author') {
    author.home(response);
  } else if(pathname ==='/authorplusprocess'){
    author.authorplus(response,request);
  } else if(pathname==='/authorupdate'){
    author.authorupdate(response,request);
  } else if(pathname==='/authorupdateprocess'){
    author.authorprocessupdate(request,response);
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
