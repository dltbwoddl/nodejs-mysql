var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var db = require("./lib/db")
var topic = require("./lib/topic")
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
    topic.create_update(request,response);
  } else if (pathname === '/update') {
    topic.update(response, queryData);
  } else if (pathname === '/update_process') {
    topic.update_process(request, response);
  } else if (pathname === '/delete_process') {
    topic.delete(request, response);
  } else if (pathname=== '/author'){
    db.query(`SELECT * FROM topic`, function (error, topics) {
      var title = 'Author List';
      console.log(topics);
      var description = `<table>
      <tr>
        <th>title</th>
        <th>profile</th> 
        <th>Age</th>
      </tr>
      <tr>
        <td>Jill</td>
        <td>Smith</td>
        <td>50</td>
      </tr>
      <tr>
        <td>Eve</td>
        <td>Jackson</td>
        <td>94</td>
      </tr>
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>80</td>
      </tr>
    </table>`;
      var list = template.list(topics);
      var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
  });
  } 
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
