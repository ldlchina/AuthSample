var databaseAccessor = require('./database/databaseAccessor.js');
var nconf = require('nconf');


var ServerApplication = function () {

	// Load config settings.
	var config = nconf.argv().env().file({ file: __dirname + '/conf.json' });
	process.env.PORT = config.get('port');
	var serviceConf = config.get(config.get('build'));
	process.env.NODE_ENV = serviceConf.node_env;

	// database
	var db = serviceConf.db;
	var dbOptions = {
		host: db.host,
		port: db.port,
		name: db.name
	};

	var dba = databaseAccessor(dbOptions);

	// user manager
	this.userManager = require('./userManager.js')({ 'databaseAccessor': dba });
	
	// auth manager
	this.authManager = require('./authManager.js')({ 'databaseAccessor': dba });
};


module.exports = new ServerApplication();

