var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');
var archiveDao = require('../dao/archiveDao.js');
/* GET users listing. */
router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

router.get('/queryAll', function(req, res, next) {
  userDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {

  // userDao.queryByName(res,req.query.name,function (err, user) {
  //   if (!user) {
  //     req.flash('error', '用户不存在!');
  //     return res.redirect('/login');//用户不存在则跳转到登录页
  //   }
  //   // var temp=new String(user[0].Phone_number);
  //   // console.log(temp);
  //   console.log(user.Password);
  //
  //
  // });

  archiveDao.queryById(res,req.query.id,function (err, archive) {
    // console.log(archive);
    if (!archive) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    // var temp=new String(user[0].Phone_number);
    // console.log(temp);
    // JSON.stringify(archive.toString, null,2);
    // console.log(archive);
    // var json = [{ title: archive.title},
    //   {title: archive.author}];
    //   var posts = JSON.stringify(json);
    //   console.log(posts);

    res.render('index', {
      title: '主页',
      // user: req.session.user,
      posts: archive,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

  });

  // console.log(user);

});

router.get('/deleteUser', function(req, res, next) {
  userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
  userDao.update(req, res, next);
});

module.exports = router;
