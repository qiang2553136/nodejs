var express = require('express');
var router = express.Router();

/* GET test listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource guo');
  return res.render('testboot');

});

module.exports = router;
