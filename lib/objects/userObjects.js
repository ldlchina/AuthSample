var util = require('../util.js');


var UserObjectFactory = function () {};

UserObjectFactory.secureUserObject = function (options) {
	options = options || {};

	return {
		"type": "user",
		"id": options.id || util.generateGUID(),
		"email": options.email,
		"firstname": options.firstname,
		"lastname": options.lastname,
		"password": options.password
	};
};

UserObjectFactory.apiUserObject = function (options) {
	options = options || {};

	return {
		"type": "user",
		"id": options.id,
		"email": options.email,
		"firstname": options.firstname,
		"lastname": options.lastname
	};
};


module.exports = UserObjectFactory;