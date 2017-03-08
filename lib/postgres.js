var pg = exports; exports.constructor = function pg(){};

var pgLib = require('pg');

pg.initialize = function(databaseUrl, cb) {
    console.log('postgre faili tuli');
    var client = new pgLib.Client(databaseUrl);
    client.connect(function(err) {
        if (err) {
            console.log('POSTGRE FAILI ERROR TULI!');
            return cb(err);
        }
        console.log('teeb midagi veel!');
        pg.client = client;
        cb();
    });
};
