var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'opentutorial'
});
 
connection.connect();
 
//비동기적 작동
connection.query('SELECT *FROM topic;', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
 
connection.end();
