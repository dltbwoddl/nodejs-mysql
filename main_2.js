var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'opentutorial'
});
db.connect();

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      // fs.readdir('./data', function(error, filelist){
      //   var title = 'Welcome';
      //   var description = 'Hello, Node.js';
      //   var list = template.list(filelist);
      //   var html = template.HTML(title, list,
      //     `<h2>${title}</h2>${description}`,
      //     `<a href="/create">create</a>`
      //   );
      //   response.writeHead(200);
      //   response.end(html);
      // });
      db.query(`SELECT title,id FROM topic`, function (error, topics) {
        console.log(topics[0].id);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      // fs.readdir('./data', function(error, filelist){
      //   var filteredId = path.parse(queryData.id).base;
      //   fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      //     var title = queryData.id;
      //     var sanitizedTitle = sanitizeHtml(title);
      //     var sanitizedDescription = sanitizeHtml(description, {
      //       allowedTags:['h1']
      //     });
      //     var list = template.list(filelist);
      //     var html = template.HTML(sanitizedTitle, list,
      //       `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      //       ` <a href="/create">create</a>
      //         <a href="/update?id=${sanitizedTitle}">update</a>
      //         <form action="delete_process" method="post">
      //           <input type="hidden" name="id" value="${sanitizedTitle}">
      //           <input type="submit" value="delete">
      //         </form>`
      //     );
      //     response.writeHead(200);
      //     response.end(html);
      //   });
      // });
      db.query(`SELECT title,id FROM topic`, function (error, topics) {
        if (error) {
          throw error;
        }
        //밑의 구문은 보안을 위한 처리임.
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id 
        WHERE topic.id=?`, [queryData.id], function (error2, des) {
          if (error2) {
            throw error2;
          }
          var list = template.list(topics);
          var title = des[0].title;
          var sanitizedDescription = sanitizeHtml(des[0].description, {
            allowedTags: ['h1']
          });
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${sanitizedDescription}<br>저자 : ${des[0].name}<br> 직업 : ${des[0].profile}`,
            ` <a href="/create">create</a>
                  <a href="/update?id=${queryData.id}">update</a>
                  <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                  </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    // fs.readdir('./data', function (error, filelist) {
    //   var title = 'WEB - create';
    //   var list = template.list(filelist);
    //   var html = template.HTML(title, list, `
    //       <form action="/create_process" method="post">
    //         <p><input type="text" name="title" placeholder="title"></p>
    //         <p>
    //           <textarea name="description" placeholder="description"></textarea>
    //         </p>
    //         <p>
    //           <input type="submit">
    //         </p>
    //       </form>
    //     `, '');
    //   response.writeHead(200);
    //   response.end(html);
    // });
    db.query(`SELECT title,id FROM topic`, function (error, topics) {
      console.log(topics[0].id);
      var title = 'WEB - ';
      var list = template.list(topics);
      var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, `${title} <a href="/create">create</a>`);
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      // fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      //   response.writeHead(302, { Location: `/?id=${title}` });
      //   response.end();
      // })
      db.query(`INSERT INTO topic (title, description,created,author_id) VALUE(?,?,NOW(),?)`, [post.title, post.description, 1], function (error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
        // db.query(`SELECT id FROM topic WHERE title=${title}`, function (error, newid) {
        //   console.log(newid);
        //   response.writeHead(302, { Location: `/?id=${newid[0].id}` });
        //   response.end();
        // })
      });
    });
  } else if (pathname === '/update') {
    // fs.readdir('./data', function (error, filelist) {
    //   var filteredId = path.parse(queryData.id).base;
    //   fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    //     var title = queryData.id;
    //     var list = template.list(filelist);
    //     var html = template.HTML(title, list,
    //       `
    //         <form action="/update_process" method="post">
    //           <input type="hidden" name="id" value="${title}">
    //           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
    //           <p>
    //             <textarea name="description" placeholder="description">${description}</textarea>
    //           </p>
    //           <p>
    //             <input type="submit">
    //           </p>
    //         </form>
    //         `,
    //       `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    //     );
    //     response.writeHead(200);
    //     response.end(html);
    //   });
    // });
    db.query(`SELECT title FROM topic`, function (error1, data1) {
      if (error1) {
        throw (error1)
      }
      db.query(`SELECT title,description,id FROM topic WHERE id=${queryData.id}`, function (error, data) {
        if (error) {
          throw (error);
        }
        var list = template.list(data1);
        var html = template.HTML(data[0].title, list,
          `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${data[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${data[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${data[0].description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
          `<a href="/create">create</a> <a href="/update?id=${data[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    })

  } else if (pathname === '/update_process') {
    console.log(11)
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      // fs.rename(`data/${id}`, `data/${title}`, function (error) {
      //   fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      //     response.writeHead(302, { Location: `/?id=${title}` });
      //     response.end();
      //   })
      // });
      // db.query(`UPDATE topic SET title=post.title,description=post.description WHERE id=?post.id`, function (error, data) {
      //   response.writeHead(302, { Location: `/?id=${post.id}` });
      //   response.end();
      //   console.log(12);
      // });
      //이코드로 실행하면 파일이 바뀌지 않는다.
      db.query(`UPDATE topic SET title=?,description=? WHERE id=?`, [post.title, post.description, post.id], function (error, data) {
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
        console.log(12);
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      // var filteredId = path.parse(id).base;
      // fs.unlink(`data/${filteredId}`, function (error) {
      //   response.writeHead(302, { Location: `/` });
      //   response.end();
      // })
      console.log(post.id);
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, data) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
