var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var userDao = require('../dao/userDao.js');
var archiveDao = require('../dao/archiveDao.js');
/* GET users listing. */
router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

/*logout*/
// router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});


router.get('/', function(req, res, next) {
  archiveDao.queryAll(res,function (err, archive) {

    if (!archive) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }

    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: archive,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

  });

});

router.get('/query', function(req, res, next) {

  archiveDao.queryById(res,req.query.id,function (err, archive) {

    if (!archive) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }

    res.render('index', {
      title: '主页',
      // user: req.session.user,
      posts: archive,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

  });

});

router.get('/deleteUser', function(req, res, next) {
  userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
  userDao.update(req, res, next);
});



/*login get*/
// router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});
/*login post*/
// router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
      console.log(password);
  //检查用户是否存在
  userDao.queryByName(req.body.username,function (err, user) {
    console.log(req.body.username);
    if (!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.Password != password) {
      req.flash('error', '密码错误!');
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });

});


// router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

/*logout*/
// router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
  var name = req.body.username,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/reg');//返回注册页
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new userDao({
      name: name,
      password: password,
      phoneNumber: req.body.Phone_number
  });

  //检查用户名是否已经存在
  userDao.queryByName(req.body.Phone_number, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }

    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }

    //如果不存在则新增用户
    userDao.save(newUser,function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });


  });
});


module.exports = router;
