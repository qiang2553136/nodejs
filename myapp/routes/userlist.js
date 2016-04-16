var express = require('express');
var router = express.Router();

/* GET test listing. */

router.get('/userlist', routes.userlist(db));

module.exports = router;
