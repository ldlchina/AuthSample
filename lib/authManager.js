var authObjectFactory = require('./objects/authObjects.js');
var util = require('./util.js');

/**
* @constructor
* @class AuthManager
* @param {Object} options
*    	databaseAccessor - the database accessor
*/
var AuthManager = function (options) {

	// Memory storage
	var _options = options || {};
	this._databaseAccessor = _options.databaseAccessor;
};

AuthManager.prototype.errorList = {
	InvalidUserId:'InvalidUserId',
	InvalidAPIKey:'InvalidAPIKey'
};

AuthManager.prototype.authByUserId = function(uid, cb){
	var _self = this;
	
	if(uid == ''){
		cb(new Error(_self.errorList.InvalidUserId));
		return;
	}
	
	var queryObject = {};
	queryObject.userid = uid;
	
	_self._databaseAccessor.query("AUTH", queryObject, function(err, auth){
		if(err){
			cb(util.internalErr());
		}
		else{
			if(auth){
				cb(null, auth);
			}
			else{
				var newAuth = authObjectFactory.apiAuthObject(queryObject);
				_self._databaseAccessor.insert("AUTH", newAuth, cb);
			}
		}
	});
};

AuthManager.prototype.authByAPIKey = function(apikey, cb){
	var _self = this;
	
	if(!apikey || apikey == ''){
		cb(new Error(_self.errorList.InvalidAPIKey));
		return;
	}
	
	var queryObject = {};
	queryObject.apikey = apikey;
	
	_self._databaseAccessor.query("AUTH", queryObject, function(err, auth){
		if(err || !auth){
			if(err){
				cb(err);
			}
			else{
				cb(new Error(_self.errorList.InvalidAPIKey));
			}
		}
		else{
			auth = authObjectFactory.apiAuthObject(auth);
			cb(null, auth);
		}
	});
}


var createAuthManager = function(options){
	return new AuthManager(options);
};

module.exports = createAuthManager;