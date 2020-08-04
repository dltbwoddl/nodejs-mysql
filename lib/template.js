module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <form action="/author">
        <input type="submit" value="author">
      </form> 
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  authorlist:function(author,id){
    var stag = `<select name="author_id">`;
    var i = 0;
    while (i < author.length) {
      if(author[i].id==id){
        stag += `<option value="${author[i].id}" selected>${author[i].name}</option>`;
      i++;
      }else{
      stag += `<option value="${author[i].id}">${author[i].name}</option>`;
      i++;}
    }
    stag +=  `</selecter>`;
    return stag;
  },
  authortemplate:function(authors){
    var authorslist = `<table>`;
      for (var i in authors) {
        authorslist += `
        <tr>
        <form action="/authordelete" method = "post">
          <th>${authors[i].name}</th>
          <th>${authors[i].profile}</th>
          <input type="hidden" name="id" value=${authors[i].id}>
          <th><a href="/authorupdate?id=${authors[i].id}">update</a></th>
          <th><input type="submit" value="delete" ></th>
          </form>
        </tr>`
      }
      authorslist+=`</table>
      <style>
      table, th, td {
        border: 1px solid black;
      }
      </style>`
      return authorslist
  }
}
