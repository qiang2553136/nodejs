var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET users listing. */
router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

router.get('/queryAll', function(req, res, next) {
  userDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {

  userDao.queryById(req, res, next);
  // console.log(user);

});

router.get('/deleteUser', function(req, res, next) {
  userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
  userDao.update(req, res, next);
});

module.exports = router;
