var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
	var serverApp = options.serverApp;
	var userMgr = serverApp.userManager;
	var authMgr = serverApp.authManager;
   
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
	
    expressApp.post('/api/1.0/users/validate', function(req, res, next){
        console.log('post ==> /api/1.0/users/validate');
		
		userMgr.login(req.body, function(err, user){
			if(err){
				next(err);
			}
			else{
				authMgr.authByUserId(user.id, function(err, auth){
					if(err){
						next(err);
					}
					else{
						res.send(200, auth);
					}
				});
			}
		});
    });
    
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;