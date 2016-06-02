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
router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

router.get('/', function(req, res, next) {
  //查询所有数据 demo
  archiveDao.queryAll(res,function (err, archive) {

    if(err){
      console.log(err);
      return res.send('<p>'+err+'</p>');;
    }

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

router.get('/test', function(req, res, next) {
  userDao.update(req, res, next);
});



/*login get*/
router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
    return res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});
/*login post*/
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
      console.log(req.body.username);
      console.log(password);
  //查询单条数据 demo
  userDao.queryByName(req.body.username,function (err, user) {
    //
    if(err){
      console.log(err);
      return res.send('<p>'+err+'</p>');;
    }
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
    return res.redirect('/');//登陆成功后跳转到主页
  });

});


router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

//注册 demo
router.post('/reg', checkNotLogin);
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
  userDao.queryByName(req.body.username, function (err, user) {

    if(err){
      console.log(err);
      return res.send('<p>'+err+'</p>');;
    }

    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返 回注册页
    }

    //如果不存在则新增用户
    userDao.save(newUser,function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      return res.redirect('/');//注册成功后返回主页
    });


  });
});
//删除 demo
router.get('/delete', checkLogin);
router.get('/delete', function (req, res) {

  userDao.delete(req.query.id,function(err,result){

    if(err){
      console.log(err);
      return res.send('<p>'+err+'</p>');
    }

    req.flash('success', result.msg);
    return res.redirect('/');//删除成功后返回主页
    req.flash('success', res);

  });
});

//更新 demo
router.get('/update', checkLogin);
router.get('/update', function (req, res) {
    return res.render('update', {
        title: '修改密码!',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});

router.post('/update', checkLogin);
router.post('/update', function (req, res) {

    var oldpwd    = req.session.user.Password,
      id          = req.session.user.Id,
      password    = req.body.password,
      password_re = req.body['password-repeat'];

    //检验用户两次输入的密码是否一致
    // if (password_re != password) {
    //     req.flash('error', '两次输入新的密码不一致!');
    //     return res.redirect('/update');//返回注册页
    // }

    var oldpassword = crypto.createHash('md5').update(req.body.oldpassword).digest('hex'),
        password    = crypto.createHash('md5').update(password).digest('hex');

    //旧密码有误
    if(oldpwd!=oldpassword){
      req.flash('error', '旧密码有误请重新输入!');
      return res.redirect('/update');//返回修改页
    }

    var User = new userDao({
        id: id,
        password:password
    });

  userDao.update(User,function(err,result){

    if(err){
      console.log(err);
      return res.send('<p>'+err+'</p>');
    }

    req.flash('success', result.msg);
    return res.redirect('/');//修改成功后返回主页
    req.flash('success', res);

  });

});

//验证登录
function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录!');
      return res.redirect('/login');
    }
    next();
  }
//验证未登录
  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!');
      return res.redirect('back');
    }
    next();
  }

module.exports = router;
