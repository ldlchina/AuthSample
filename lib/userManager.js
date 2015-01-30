var userObjectFactory = require('./objects/userObjects.js');
var util = require('./util.js');

/**
* @constructor
* @class UserManager
* @param {Object} options
*    	databaseAccessor - the database accessor
*/
var UserManager = function (options) {

	// Memory storage
	var _options = options || {};
	this._databaseAccessor = _options.databaseAccessor;
};

UserManager.prototype.errorList = {
	NullStrings:'NullStrings',
	SignupPasswordsUnsame:'SignupPasswordsUnsame',
	SignupEmailExists:'SignupEmailExists',
	AccountNotExists:'AccountNotExists',
	WrongPassword:'WrongPassword',
	InvalidUserId:'InvalidUserId'
};

UserManager.prototype.addUser = function(options, cb){
	var _options = options || {};
	var _self = this;
	
	if(_options.email == '' || _options.firstname == '' || _options.lastname == '' || _options.password == '' || _options.repassword == ''){
		cb(new Error(_self.errorList.NullStrings));
		return;
	}

	if(_options.password != _options.repassword){
		cb(new Error(_self.errorList.SignupPasswordsUnsame));
		return;
	}
	
	var queryObject = {};
	queryObject.email = _options.email;
	
	_self._databaseAccessor.query("USER", queryObject, function(err, user){
		if(err || user){
			if(err){
				cb(err);
			}
			else{
				cb(new Error(_self.errorList.SignupEmailExists));
			}
		}
		else{
			var newUser = userObjectFactory.secureUserObject(_options);
			newUser.password = util.hash(newUser.password);
			_self._databaseAccessor.insert("USER", newUser, cb);
		}
	});
};

UserManager.prototype.login = function(options, cb){
	var _options = options || {};
	var _self = this;
	
	if(_options.account == '' || _options.password == ''){
		cb(new Error(_self.errorList.NullStrings));
		return;
	}

	var queryObject = {};
	queryObject.email = _options.account;
	
	_self._databaseAccessor.query("USER", queryObject, function(err, user){
		if(err || !user){
			if(err){
				cb(err);
			}
			else{
				cb(new Error(_self.errorList.AccountNotExists));
			}
		}
		else{
			var psw = util.hash(_options.password);
			if(user.password != psw){
				cb(new Error(_self.errorList.WrongPassword));
			}
			else{
				user = userObjectFactory.apiUserObject(user);
				cb(null, user);
			}
		}
	});
};

UserManager.prototype.userById = function(id, cb){
	var _self = this;
	
	if(!id || id == ''){
		cb(new Error(_self.errorList.InvalidUserId));
		return;
	}
	
	var queryObject = {};
	queryObject.id = id;
	
	_self._databaseAccessor.query("USER", queryObject, function(err, user){
		if(err || !user){
			cb(util.internalErr());
		}
		else{
			user = userObjectFactory.apiUserObject(user);
			cb(null, user);
		}
	});
}


var createUserManager = function(options){
	return new UserManager(options);
};

module.exports = createUserManager;