$(document).ready(function(){
	loadProperties('main', '../strings/main/');
	
	$("#nav-signup").hide();
	$("#nav-login").hide();
	$("#nav-logout").hide();
	
	if($("#nav-userAccount").text() != ''){
		$("#nav-logout").show();
	}
});

function sendRequest(type, url, body, cb){
	$.ajax({
		type:type,
		url:url, 
		beforeSend:function(xhr){
		},
		complete:function(xhr, ts){
		},
		contentType:'application/x-www-form-urlencoded',
		data:body,
		dataFilter:function(data, type){
			return data;
		},
		datatype:'json',
		error:function(xhr, err, e){
			cb(err + ': ' + xhr.responseText);
		},
		success:function(data){
			cb(null, data);
		}
	});
}

function loadProperties(name, path){
	var lang = navigator.language;
	jQuery.i18n.properties({
		name:name, 
		path:path,
		mode:'map',
		language: lang,
		callback: function() {
			$("[data-localize]").each(function() {
				var elem = $(this),
					localizedValue = jQuery.i18n.map[elem.data("localize")];
				
				if (elem.is("input[type=text]") || elem.is("input[type=password]") || elem.is("input[type=email]")) {
					elem.attr("placeholder", localizedValue);
				} else if (elem.is("input[type=button]") || elem.is("input[type=submit]")) {
					elem.attr("value", localizedValue);
				} else {
					elem.text(localizedValue);
				}
			});
		}
	});
}