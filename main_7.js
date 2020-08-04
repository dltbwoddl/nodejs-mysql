//보안이슈 : 웹으로부터 들어오는 정보는 오염됐다는 전제하에 작업하기.
//sql injection
//query문에서 sql문을 사용할 때 ? []을 사용하는 이유는 입력자가 
//sql문을 입력했을 때 string으로 자동처리하기 위해서이다.

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
    author.authorupdateprocess(request,response);
  } else if(pathname==='/authordelete'){
    //삭제는 폼으로 처리해야 한다 a가 아니라 그이유는??
    author.authordelete(request,response);
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
