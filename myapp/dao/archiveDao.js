// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $sql = require('./archiveSqlMapping.js');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

function Archive(archive) {
  this.title = archive.archive_title;
  this.author = archive.archive_author;
  this.archive_pubtime = archive.archive_pubtime;
};


// 向前台返回JSON方法的简单封装
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

module.exports = Archive;

  // add: function (req, res, next) {
  //   pool.getConnection(function(err, connection) {
  //     // 获取前台页面传过来的参数
  //     var param = req.query || req.params;
  //
  //     // 建立连接，向表中插入值
  //     // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
  //     connection.query($sql.insert, [param.name, param.age], function(err, result) {
  //       if(result) {
  //         result = {
  //           code: 200,
  //           msg:'增加成功'
  //         };
  //       }
  //
  //       // 以json形式，把操作结果返回给前台页面
  //       jsonWrite(res, result);
  //
  //       // 释放连接
  //       connection.release();
  //     });
  //   });
  // },
  // delete: function (req, res, next) {
  //   // delete by Id
  //   pool.getConnection(function(err, connection) {
  //     var id = +req.query.id;
  //     connection.query($sql.delete, id, function(err, result) {
  //       if(result.affectedRows > 0) {
  //         result = {
  //           code: 200,
  //           msg:'删除成功'
  //         };
  //       } else {
  //         result = void 0;
  //       }
  //       jsonWrite(res, result);
  //       connection.release();
  //     });
  //   });
  // },
  // update: function (req, res, next) {
  //   // update by id
  //   // 为了简单，要求同时传name和age两个参数
  //   var param = req.body;
  //   if(param.name == null || param.age == null || param.id == null) {
  //     jsonWrite(res, undefined);
  //     return;
  //   }
  //
  //   pool.getConnection(function(err, connection) {
  //     connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
  //       // 使用页面进行跳转提示
  //       if(result.affectedRows > 0) {
  //         res.render('suc', {
  //           result: result
  //         }); // 第二个参数可以直接在jade中使用
  //       } else {
  //         res.render('fail',  {
  //           result: result
  //         });
  //       }
  //
  //       connection.release();
  //     });
  //   });
  //
  // },
  Archive.queryById = function (res,id, callback) {
     // 为了拼凑正确的sql语句，这里要转下整数

     pool.getConnection(function(err, connection) {
       if (err) {
      
         return callback(err);//错误，返回 err 信息
       }
       connection.query($sql.queryById, id, function(err, result) {

         if (err) {
                   return callback(err);//失败！返回 err 信息
                 }
                 //查出数据转时间换为 2016-01-10 19:19:31格式
                 for (var i = 0; i < result.length; i++) {
                   var temp =result[i].archive_pubtime;
                   var date = new Date( temp * 1000 );//.转换成毫秒
                   var time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1))
                   + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
                   + " " + (date.getHours())
                   + ":" + (date.getMinutes())
                   + ":" + (date.getSeconds());
                  //  console.log(result[1].archive_pubtime);

                   result[i].archive_pubtime = time;
                 }

        callback(null, result);
        // jsonWrite(res, result[1]);
        connection.release();

      });

    });

  };
  Archive.queryAll = function (res, callback) {
     // 为了拼凑正确的sql语句，这里要转下整数

     pool.getConnection(function(err, connection) {
       if (err) {
         return callback(err);//错误，返回 err 信息
       }
       connection.query($sql.queryAll, function(err, result) {

         if (err) {
                  // console.log("数据库出现错误,代码:"+err.code);
                   return callback(err);//失败！返回 err 信息
                 }
                 //查出数据转时间换为 2016-01-10 19:19:31格式
                 for (var i = 0; i < result.length; i++) {
                   var temp =result[i].archive_pubtime;
                   var date = new Date( temp * 1000 );//.转换成毫秒
                   var time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1))
                   + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
                   + " " + (date.getHours())
                   + ":" + (date.getMinutes())
                   + ":" + (date.getSeconds());
                  //  console.log(result[1].archive_pubtime);

                   result[i].archive_pubtime = time;
                 }

            // console.log(result);

        callback(null, result);
        // jsonWrite(res, result[1]);
        connection.release();

      });

    });

  };
