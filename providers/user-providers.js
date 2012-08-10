var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


UserProvider = function(host, port, callback){
	this.db = new Db('remoteImpress', new Server(host,port, {auto_reconnet: true},{}));
	this.db.open(function(err, db){
			callback(err);
	});
};


UserProvider.prototype.getCollection = function(callback) {
	this.db.collection('users', function(error, user_collection){
		if(error) callback(error);
		else callback(null, user_collection);
	});	
};

UserProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error,user_collection){
		if(error)
			callback(error);
		else {
			user_collection.find().toArray(function(error, result){
				if( error ) callback(error);
	        	else callback(null, result);
			});	
		}
	});
};

UserProvider.prototype.findById = function(id,callback) {
	this.getCollection(function(error,user_collection){
		if(error)
			callback(error);
		else {
			user_collection.findOne({_id: id}, function(error, result){
				if( error ) callback(error);
	        	else callback(null, result);
			});	
		}
	});
};
//This method saves a user into DB
UserProvider.prototype.save = function(user,callback) {
	this.getCollection(function(error,user_collection) {
		if(error)
			callback(error);
		else {
			//console.dir(user_collection);
			//console.log(typeof user_collection);
			//console.log(typeof user);
			user.created_at = new Date();
			user_collection.insert(user,{safe:true},function(errors, user) {
				if(errors)
					console.log(errors);
			});
		}
	});
};

exports.UserProvider = UserProvider;