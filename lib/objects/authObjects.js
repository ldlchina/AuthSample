var util = require('../util.js');


var AuthObjectFactory = function () {};

AuthObjectFactory.apiAuthObject = function (options) {
	options = options || {};

	return {
		"type": "auth",
		"apikey": options.apikey || encodeURIComponent(util.generateGUID()),
		"userid": options.userid
	};
};


module.exports = AuthObjectFactory;