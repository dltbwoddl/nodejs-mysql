
var db = require("./db");
var template = require('./template');
var qs = require('querystring');

exports.home = function (response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error, authors) {
      var title = 'Author List';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${template.authortemplate(authors)}
        <form action="/authorplusprocess" method="post">
        <input type="text" name="name" placeholder="name"><br><br>
        <textarea name="profile" placeholder="profile"></textarea><br><br>
        <input type="submit" value="author">
      </form> `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}
exports.authorplus = function (response, request) {
  console.log(10);
  var body = '';
  request.on('data', function (data) {
    body = body + data;
    console.log(data);
  });
  request.on('end', function () {
    var post = qs.parse(body);
    console.log(10);
    console.log(post.name);
    db.query(`INSERT INTO author (name, profile) VALUE(?,?)`, [post.name, post.profile], function (error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: `/author` });
      response.end();
    });
  });
}
//post로 정보를 주고 받을 수도 있고 쿼리스트링으로 정보를 받아서 볼 수도 있다.
exports.authorupdate = function (response, request) {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    console.log(post.id);
    db.query(`SELECT * FROM topic`, function (error_1, topics) {
      db.query(`SELECT * FROM author`, function (error_2, authors) {
        db.query(`SELECT * FROM author WHERE id=?`,[post.id], function (error_3,sauthor) {
          console.log(sauthor);
          var title = 'Author List';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${template.authortemplate(authors)}
        <form action="/authorupdateprocess" method="post">
        <input type="text" name="name" placeholder="${sauthor[0].name}"><br><br>
        <textarea name="profile" placeholder="${sauthor[0].profile}"></textarea><br><br>
        <input type="hidden" name="id" value=${sauthor[0].id}>
        <input type="submit" value="authorupdate">
      </form> `,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    });
  });
}
exports.authorprocessupdate = function (request,response) {
  console.log(10);
  var body = '';
  request.on('data', function (data) {
    body = body + data;
    console.log(data);
  });
  request.on('end', function () {
    var post = qs.parse(body);
    console.log(10);
    console.log(post.name);
    db.query(`UPDATE author SET name=?,profile=? WHERE id=?`,
    [post.name, post.profile, post.id], function (error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, { Location: `/author` });
      response.end();
    });
  });
}