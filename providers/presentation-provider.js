var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
//var BSON = require('mongodb').BSON;
//var ObjectID = require('mongodb').ObjectID;
var userError = require ('../modules/userErrors.js')

PresentationProvider = function(host, port, callback){
	this.db = new Db('remoteImpress', new Server(host,port, {auto_reconnect: true},{}));
	this.db.open(function(err, db){
			callback(err);
	});
};

PresentationProvider.prototype.getCollection = function(callback) {
	this.db.collection('presentations', function(error, presentation_collection){
		if(error) callback(error);
		else callback(null, presentation_collection);
	});	
};


PresentationProvider.prototype.findByUser = function(user, callback) {
	this.getCollection(function(error, presentation_collection){
		if(error)
			callback(error);
		else {
			presentation_collection.findOne({user_id: user._id}, function(error, result){
	        	callback(error, result);
			});	
		}
	});
};

PresentationProvider.prototype.save = function(presentation, callback) {
	this.getCollection(function(error,presentation_collection) {
		if(error)
			callback(error,presentation);
		else {
			presentation.created_at = new Date();
			presentation_collection.insert(presentation,{safe:true},function(error, presentation_array) {
				if(error){
					console.log(error);
				}
				callback(error, presentation_array, response);
			});
		}
	});
};

PresentationProvider.prototype.update = function(presentation, response, callback) {
	this.getCollection(function(error,presentation_collection) {
		if(error)
			callback(error, presentation);
		else {
			presentation.last_updated = new Date();
			presentation_collection.save(presentation, {safe:true}, function(error) {
				if(error){
					console.log(error);
				}
				callback(error, presentation);
			});
		}
	});
};

exports.PresentationProvider = PresentationProvider;