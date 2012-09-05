var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
//var BSON = require('mongodb').BSON;
//var ObjectID = require('mongodb').ObjectID;
var userError = require ('../modules/userErrors.js')
var userModel = require('../models/user');

UserProvider = function(host, port, callback){
	this.db = new Db('remoteImpress', new Server(host,port, {auto_reconnect: true},{}));
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

UserProvider.prototype.findAll = function(response, callback) {
	this.getCollection(function(error,user_collection){
		if(error)
			callback(error,result,response);
		else {
			user_collection.find().toArray(function(error, result){
				 callback(error,result,response);
			});	
		}
	});
};

UserProvider.prototype.findById = function(id,response, options, callback) {
	this.getCollection(function(error, user_collection){
		if(error)
			callback(error);
		else {
			user_collection.findOne({_id: id}, function(error, result){
				// If we did not find a result and there is no error, we create an error to display
				if(!result && !error) error = new userError(001,"No User found");
				// In all cases, we callback
	        	callback(error, result, response, options);
			});	
		}
	});
};

//This method saves a user into DB
UserProvider.prototype.save = function(user, response, callback) {
	this.getCollection(function(error,user_collection) {
		if(error)
			callback(error,user,response);
		else {
			user.created_at = new Date();
			user_collection.insert(user,{safe:true},function(error, user_array) {
				if(error){
					console.log(error);
					if(error.code == 11000) 
						error = new userError(002 , "A user already exists with this id");
				}
				//The insert method returns an array even if there is only one record inserted
				//Since we know there is only one user inserted at a time, we can *safely* pass array[0] to the callback
				callback(error, user_array ? user_array[0] : user_array, response);
			});
		}
	});
};

UserProvider.prototype.update = function(user, response, callback) {
	this.getCollection(function(error,user_collection) {
		if(error)
			callback(error, user, response);
		else {
			user.last_updated = new Date();
			user_collection.save(user, {safe:true}, function(error) {
				if(error){
					console.log(error);
				}
				callback(error, user, response);
			});
		}
	});
};

UserProvider.prototype.getPresentationByUserIdAndPresensationKey = function(user, presentationKey , response, callback) {
	this.getCollection(function(error,user_collection) {
		if(error)
			callback(error);
		else {
			user_collection.find({_id:user._id},['presentations'], function(error, cursor) {
				if(error){
					console.log(error);
				}
				else {
					cursor.nextObject(function(err,obj){
						if(err) {
							console.log(err);
							callback(err);
						}
						else {
							presentations = obj.presentations;
							
							if(Array.isArray(presentations)){
								var i = 0;
								var found = false;
								for(i=0;i<presentations.length;i++){
									if(presentations[i].key == presentationKey){
										found =  true;
										callback(err,presentations[i],user,response)
									}
								}
								if(!found)
									callback("no such presentation Key for user with id : " + user._id);	
							}
							else {
								callback("presentation object is not an Array, this is pretty serious and should be investigated");	
							}
						}
					});
				}
				//callback(error, user, response);
			});
		}
	});
}

UserProvider.prototype.addNewPresentation = function(user, response, callback) {
	this.getCollection(function(error,user_collection) {
		if(error)
			callback(error, user, response);
		else {
			user.last_updated = new Date();
			user_collection.save(user, {safe:true}, function(error) {
				if(error){
					console.log(error);
				}
				callback(error, user, response);
			});
		}
	});
};


exports.UserProvider = UserProvider;