// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db.js');
var $sql = require('./userSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.phoneNumber = user.phoneNumber;
  this.id = user.id;
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

module.exports = User;

User.save =  function (user,callback) {
    pool.getConnection(function(err, connection) {

      // 建立连接，向表中插入值
      // 'INSERT INTO ff_users(Username, Phone_number,Password) VALUES(?,?,?)',
      connection.query($sql.insert, [user.name,user.phoneNumber,user.password], function(err, result) {

          if (err) {

            return callback(err);//错误，返回 err 信息
          }

        if(result) {
          result = {
            code: 200,
            msg:'增加成功'
          };
        }
        // 以json形式，把操作结果返回给前台页面
        callback(null, result);

        // 释放连接
        connection.release();
      });
    });
  };

  User.delete = function (id,callback) {

    pool.getConnection(function(err, connection) {

      connection.query($sql.delete,id, function(err, result) {

        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功!'
          };
        } else {
          result = {
            code: 404,
            msg:'未找到对应数据!'
          };
        }
        //返回数据
        callback(null, result);
        // 释放连接
        connection.release();
      });
    });
  };
  User.update = function (user,callback) {

    console.log(user);
    pool.getConnection(function(err, connection) {
      connection.query($sql.update, [user.password,user.id], function(err, result) {

        console.log(result);
        // 使用页面进行跳转提示
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'修改成功!'
          };
        } else {
          result = {
            code: 404,
            msg:'未找到对应数据!'
          };
        }
        //返回数据
        callback(null, result);
        // 释放连接
        connection.release();
      });
    });

  };
  User.queryByName = function (Phone_number, callback) {
     // 为了拼凑正确的sql语句，这里要转下整数

     pool.getConnection(function(err, connection) {
       if (err) {

         return callback(err);//错误，返回 err 信息
       }

       connection.query($sql.queryById, Phone_number, function(err, result) {
         if (err) {
                   return callback(err);//失败！返回 err 信息
                 }

        callback(null, result[0]);
        // jsonWrite(res, result[0]);
        connection.release();

      });

    });

  };
  // queryAll: function (req, res, next) {
  //   pool.getConnection(function(err, connection) {
  //     connection.query($sql.queryAll, function(err, result) {
  //       jsonWrite(res, result);
  //       connection.release();
  //     });
  //   });
  // }
