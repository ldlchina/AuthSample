var dateFormat = require('dateformat'); 
var uuid = require('node-uuid'); 
var crypto = require('crypto');
var nconf = require('nconf');

// Load config settings.
var config = nconf.argv().env().file({ file: __dirname + '../conf.json' });
var serviceConf = config.get(config.get('build'));

/**
* Normilize the date time string to ISO 8601 standard. 
* @param dateTime - the data time object
* @return {string} The date time string. Such as 2012-11-09T13:44:01Z
*/
var normalizeDateTime = function(dateTime){
	var isoDate = dateFormat(dateTime, "isoUtcDateTime"); // 2012-11-09T13:44:01Z
	return isoDate;
}

/**
* Get the current date time. 
* @return {string} The date time string. Such as 2012-11-09T13:44:01Z
*/
var getCurrentDateTime = function(){
	return normalizeDateTime(new Date());
}

/**
* Generate a GUID. 
* @return {string} GUID.
*/
var generateGUID = function(){
	return uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
}

/**
* Get hash password of specific content. 
* param content - the original content
* @return password.
*/
var hash = function (content) {
    return crypto.createHash('sha1').update(content).digest('hex');
}

 /**
  * Get client ip from request.
  * param req - request
  * @return ip.
  */
var getClientIp = function (req) {
     var ipAddress;
     // The request may be forwarded from local web server.
     var forwardedIpsStr = req.header('x-forwarded-for');
     if (forwardedIpsStr) {
         // 'x-forwarded-for' header may return multiple IP addresses in
         // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
         // the first one
         var forwardedIps = forwardedIpsStr.split(',');
         ipAddress = forwardedIps[0];
     }
     if (!ipAddress) {
         // If request was not forwarded
         ipAddress = req.connection.remoteAddress;
     }
     return ipAddress;
 }

 /**
  * Get file extension from input file name. It will return null if it cannot get extension from input file name.
  * @param filename
  */
 var getFileExtension = function(filename){
    if(!filename || typeof(filename) != 'string'){
        return null;
    }

    var index = filename.lastIndexOf('.');
    if(index == -1){
        return null;
    }

    return filename.substr(index+1);
 }
 
var accessLevel = function(uid, dashboard){
	if(!uid || uid == ''){
		return 'ad';
	}
	
	if(!dashboard){
		return 'ad';
	}
	
	if(uid == dashboard.owner){
		return 'rw';
	}
	else if(dashboard.privilege == 'public'){
		return 'ro';
	}
	else{
		return 'ad';//access denied
	}
}

var internalErr = function(){
	return new Error('InternalError');
}

var reqLanguage = function(req){
	
}

module.exports.normalizeDateTime = normalizeDateTime;
module.exports.getCurrentDateTime = getCurrentDateTime;
module.exports.generateGUID = generateGUID;
module.exports.hash = hash;
module.exports.getClientIp = getClientIp;
module.exports.getFileExtension = getFileExtension;
module.exports.accessLevel = accessLevel;
module.exports.internalErr = internalErr;