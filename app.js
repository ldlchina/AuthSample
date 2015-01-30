var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serverApp =  require('./lib/serverApplication.js');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'WebCharts session'
}));

// get user from cookie
app.use(function(req, res, next){
	if(req.session.user){
		next();
		return;
	}
	
	var userMgr = serverApp.userManager;
	userMgr.userById(req.cookies.uid, function(err, user){
		req.session.user = user;
		next();
	});
});

// Session-persisted message middleware
app.use(function(req, res, next){
	next();
});

// auth validation for API requests
app.use(function(req, res, next){
	if(!req.url.match('/api')){
		next();
		return;
	}
	
	if(req.url.match('/validate')){
		next();
		return;
	}
	
	var authMgr = serverApp.authManager;
	if(req.session.user){
		authMgr.authByUserId(req.session.user.id, function(err, auth){
			if(err || !auth){
				next(new Error('AuthenticationFailed'));
			}
			else{
				req.auth = auth;
				next();
			}
		});
		return;
	}
	
	authMgr.authByAPIKey(req.headers.apikey, function(err, auth){
		if(err || !auth){
			next(new Error('AuthenticationFailed'));
		}
		else{
			req.auth = auth;
			next();
		}
	});
});

require('./routes/router.js')({'expressApp': app, 'serverApp':serverApp});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
