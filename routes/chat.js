var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/chat', function(req, res) {
  res.render('chat');
});

module.exports = router;
