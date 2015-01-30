var local = 'zh-cn';

var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
	var serverApp = options.serverApp;
	var userMgr = serverApp.userManager;
	var cookieMaxAge = 1000 * 60 * 60 * 24 * 30;
	
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
    
	expressApp.get('/', function(req, res, next){
        console.log('get ==> /');
		
		if(!req.session.user){
			res.redirect('/users/login');
			return;
		}
		
		res.locals.userAccount = req.session.user.email;
		res.render('home', {});
    });
	
    expressApp.get('/users/login', function(req, res, next){
        console.log('get ==> /users/login');
		
		if(req.session.user){
			res.redirect('/');
			return;
		}
		
		res.locals.userAccount = '';
		
		res.render('login', {});
    });
	
	expressApp.post('/users/login', function(req, res, next){
        console.log('post ==> /users/login');
		
		userMgr.login(req.body, function(err, user){
			if(err){
				next(err);
			}
			else{
				res.cookie('uid', user.id, { maxAge: cookieMaxAge });

				req.session.regenerate(function(){
					req.session.user = user;
					res.redirect('/');
				});
			}
		});
    });
	
	expressApp.get('/users/signup', function(req, res, next){
        console.log('get ==> /users/signup');
		
		if(req.session.user){
			res.redirect('/');
			return;
		}
		
		res.locals.userAccount = '';
		
		res.render('signup', {});
    });
	
	expressApp.post('/users/signup', function(req, res, next){
        console.log('post ==> /users/signup');
		
		userMgr.addUser(req.body, function(err, user){
			if(err){
				next(err);
			}
			else{
				res.cookie('uid', user.id, { maxAge: cookieMaxAge });

				req.session.regenerate(function(){
					req.session.user = user;
					res.redirect('/');
				});
			}
		});
    });
	
	expressApp.get('/users/logout', function(req, res, next){
        console.log('get ==> /users/logout');
		
		res.clearCookie('uid');

		req.session.destroy(function(){
			res.redirect('/users/login');
		});
    });
    
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;