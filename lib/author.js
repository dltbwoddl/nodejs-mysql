
var db = require("./db");
var template = require('./template');
var qs = require('querystring');

exports.home=function(response){
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
exports.authorplus=function(response,request){
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
      response.writeHead(302, { Location: `/author`});
      response.end();
    });
  });
}
exports.authorupdate=function(response){
  db.query(`SELECT * FROM topic`, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error, authors) {
      var title = 'Author List';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${template.authortemplate(authors)}
        <form action="/authorupdateprocess" method="post">
        <input type="text" name="name" placeholder="name"><br><br>
        <textarea name="profile" placeholder="profile"></textarea><br><br>
        <input type="submit" value="update">
      </form> `,
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.authorupdateprocess=function(response,request){
  console.log(11)
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    // db.query(`UPDATE topic SET title=post.title,description=post.description WHERE id=?post.id`, function (error, data) {
    //   response.writeHead(302, { Location: `/?id=${post.id}` });
    //   response.end();
    //   console.log(12);
    // });
    //이코드로 실행하면 파일이 바뀌지 않는다.
    db.query(`UPDATE topic SET title=?,description=?,author_id=? WHERE id=?`,
      [post.title, post.description, post.author_id, post.id], function (error, data) {
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
        console.log(post.id);
      });
  });
}