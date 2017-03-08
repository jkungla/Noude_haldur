var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET users listing. */
router.get('/', function(req, res) {
    var sql = 'SELECT c.id, c.viitenumber as viitenumber, u.callsign as tegeleja, c.summa as summa, ' +
        'GREATEST((c.summa - SUM(COALESCE(p.summa,0))),0) as jaak ' +
        'FROM claims c ' +
        'LEFT JOIN users u ON (u.id=c.tegeleja_id) ' +
        'LEFT JOIN payments p ON (p.noue_id=c.id) ' +
        'WHERE c.tegeleja_id = $1 ' +
        'group by c.id,u.callsign';

    pg.on('error', function (e) {
        console.log(e);
        // pg.connect ei suuda mul Windowsi masinas millegipärast ebaõnnestunud ühendust normaalselt kinni püüda.
    });
    var error = false;
    pg.connect(req.session.connstring, function(err, client, done) {
        if(err) {
            done();
            error = true;
        }
        if (error == false) {
            client.query(sql,[req.session.user_id], function(err, result) {
                done();
                if(err) {
                    console.log(err);
                    return res.redirect("/logout");
                }
                setTimeout(function() {
                    console.log("HELLO!");
                    res.render('claims', { title: 'Nõuded', claims: result.rows, session: req.session });
                }, 100);

            });
        } else {
            res.redirect("/logout");
        }
    });
});

router.get('/:viitenumber', function(req, res) {
    var sql = 'SELECT c.id, c.viitenumber as viitenumber, u.callsign as tegeleja, c.summa as summa, ' +
        'GREATEST((c.summa - SUM(COALESCE(p.summa,0))),0) as jaak ' +
        'FROM claims c ' +
        'LEFT JOIN users u ON (u.id=c.tegeleja_id) ' +
        'LEFT JOIN payments p ON (p.noue_id=c.id) ' +
        'WHERE c.viitenumber = $1 ' +
        'group by c.id,u.callsign';

    pg.on('error', function (e) {
        console.log(e);
        // pg.connect ei suuda mul Windowsi masinas millegipärast ebaõnnestunud ühendust normaalselt kinni püüda.
    });
    var error = false;
    pg.connect(req.session.connstring, function(err, client, done) {
        if(err) {
            done();
            error = true;
        }
        if (error == false) {
            client.query(sql,[req.params.viitenumber], function(err, result) {
                done();
                if(err) {
                    console.log(err);
                    return res.redirect("/logout");
                }
                setTimeout(function() {
                    console.log("HELLO!");
                    res.render('claim', { title: 'Nõuded', claim: result.rows[0], session: req.session });
                }, 100);

            });
        } else {
            res.redirect("/logout");
        }
    });
});

router.post('/json', function(req, res) {
    console.log(req.body);
    var sql = 'SELECT c.id, c.viitenumber as viitenumber, u.callsign as tegeleja, c.summa as summa, ' +
        'GREATEST((c.summa - SUM(COALESCE(p.summa,0))),0) as jaak, NULL as action ' +
        'FROM claims c ' +
        'LEFT JOIN users u ON (u.id=c.tegeleja_id) ' +
        'LEFT JOIN payments p ON (p.noue_id=c.id) ' +
        // 'WHERE c.tegeleja_id = $1 ' +
        'group by c.id,u.callsign';

    pg.on('error', function (e) {
        console.log(e);
        // pg.connect ei suuda mul Windowsi masinas millegipärast ebaõnnestunud ühendust normaalselt kinni püüda.
    });
    var error = false;
    pg.connect(req.session.connstring, function(err, client, done) {
        if(err) {
            done();
            error = true;
        }
        if (error == false) {
            client.query(sql, function(err, result) { //,[req.session.user_id]
                done();
                if(err) {
                    console.log(err);
                    return res.redirect("/logout");
                }
                setTimeout(function() {
                    var json = {};
                    var arr = [];

                    result.rows.forEach(function(json){
                        var arr1 = [];
                        var keys = Object.keys(json);
                        keys.forEach(function(key){
                            arr1.push(json[key]);
                        });
                        arr.push(arr1);
                        // arr1.push(result.rows[key]);
                    });
                    // json.aaData = arr;
                    json.aaData = result.rows;
                    res.send(json);
                    // res.render('claims', { title: 'Nõuded', claims: result.rows, session: req.session });
                }, 100);

            });
        } else {
            res.redirect("/logout");
        }
    });
});

module.exports = router;
