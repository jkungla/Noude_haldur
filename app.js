var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var pg = require('./lib/postgres');
var pg = require('pg');

var index = require('./routes/index');
var users = require('./routes/users');
var claims = require('./routes/claims');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'JarmoDevSecret12345',
    resave: true,
    saveUninitialized: true
}));


//AUTH
app.post('/auth', function(req, res){
    if (req.session.loggedin) {
        next();
    } else {  // if someone tries to login
        if (req.body.user&&req.body.pass) {
            var conString = "postgres://ee."+req.body.user+":"+req.body.pass+"@localhost/postgres";
            pg.on('error', function (e) {
                console.log(e);
                // pg.connect ei suuda mul Windowsi masinas millegipärast ebaõnnestunud ühendust normaalselt kinni püüda.
            });
            var error = false;
            pg.connect(conString, function(err, client, done) {
                if(err) {
                    done();
                    error = true;
                }
                if (error == false) {
                    client.query('SELECT * FROM users WHERE lower(callsign) = lower($1::text) LIMIT 1',[req.body.user], function(err, result) {
                        done();
                        if(err) {
                            res.json({ success: false, message: 'Sellist kasutajat pole.' });
                        }
                        if (result.rows.length == 1) {
                            var user = req.body.user;
                            var password = req.body.password;
                            // sanity checking here
                            req.session.loggedin = true;
                            req.session.user = req.body.user;
                            req.session.user_id = result.rows[0].id;
                            req.session.name = result.rows[0].name;
                            req.session.connstring = conString;
                            console.log('User ' + req.session.name + ' just logged in');
                            res.json({ success: true });
                        } else {
                            res.json({ success: false, message: 'Sellist kasutajat pole.' });
                        }
                    });
                } else {
                    return res.json({ success: false, message: 'Sellist kasutajat pole.' });
                }

            });
        }
        else {
            return res.json({ success: false, message: 'Vale post' });
        }
    }
});

//CHECK AUTH
app.use(function(req, res, next){
    if (req.session.loggedin) {
        next();
    } else {
        res.render('login');
    }
});

app.get('/logout', function(req, res){
    req.session.destroy(function(err) {
        console.log(err);
    });
    res.redirect('/');
});

app.use('/', index);
app.use('/users', users);
app.use('/claims', claims);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
