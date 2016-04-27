
var mysql  = require('mysql');

var connection = mysql.createConnection({
  host     : '192.168.31.122',
  user     : 'root',
  password : '123',
  port: '3306',
  database: 'fenfen',
});

connection.connect();
// console.log(require("mysql"))

var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};


var  userGetSql = 'SELECT * FROM ff_users';
//查 query
connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }

       console.log('---------------SELECT----------------');
       console.log(result);
      // if(result)
      //      {
      //          for(var i = 0; i < result.length; i++)
      //          {
      //              console.log("%d\t%s\t%s" ,result[i].Id,result[i].Phone_number);
      //          }
      //      }

       connection.end();
       console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
});
// connection.query(userGetSql, function (err2, rows) {
//            if (err2) console.log(err2);
//
//            console.log("SELECT ==> ");
//            for (var i in rows) {
//                console.log(rows[i].Id);
//                console.log("-----"+i);
//            }
          //  connection.end();
//          });
