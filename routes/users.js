var express = require('express');
var router = express.Router();
var postgres = require('../lib/postgres');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var sql = 'SELECT * FROM users';
  postgres.client.query(sql, function(err, results) {
      if (err) {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ['Could not retrieve photo'] });
      }
      return res.json(results.rows);
  });
});

module.exports = router;

