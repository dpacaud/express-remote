var UserProvider = require('../providers/user-providers.js').UserProvider;
var PresentationProvider = require('../providers/presentation-provider.js').PresentationProvider;
var userModel = require('../models/user');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


/*
 * GET USER LIST
 *
 */

var userProvider = new UserProvider('127.0.0.1', 27017, function(err){
  if(err)
      console.log(err);
  }
);

var presentationProvider = new PresentationProvider('127.0.0.1', 27017, function(err){
  if(err)
      console.log(err);
  }
);

exports.getUserList = function(req,res) {
	userProvider.findAll(res , renderUserList);
}

exports.getUser = function(req,res) {
  userProvider.findById(req.params.id, res, {edit:false}, renderUser);
}

exports.editUser = function(req,res) {
  userProvider.findById(req.params.id, res, {edit:true}, renderUser);
}

exports.putUser = function(req,res) {
  //console.log(req);
  user = new userModel(req.body.email,req.body.name,req.body.firstName,req.body.age);
  userProvider.save(user,res,renderUser);
}

exports.updateUser = function(req,res){
  console.log(req.body);
  // we get the user from DB and then update the needed parameters
  userProvider.findById(req.params.id, res, {edit:true},function(err, user){
    if(err) renderUser(err);
    else {
      user.name = req.body.name;
      user.firstName = req.body.firstName;
      userProvider.update(user,res,renderUser);
    }
  });
}

exports.addUser = function(req,res){
  res.render('userAdd',{title : "New User"});
}

//this method adds a presentation to a user
exports.addPresentation = function(req,res) {
  userProvider.findById(req.params.id, res, {edit:true},function(err, user){
    if(err) renderUser(err);
    else {
      if(user.presentations)
        user.presentations.push({name : req.body.name, content:req.body.content, type:req.body.type});
      else
        user.presentations = new Array({name : req.body.name, content:req.body.content, type:req.body.type});
      
      userProvider.update(user,res,renderUser);
    }
  });
}


function renderUser(err, _user, res, options){
  console.log(_user);
  isEdit = null;
  if(options && typeof options === 'object'){
    isEdit = options.edit;
  }
  res.render('user', {title : 'User Profile', user : _user, error : err, _isEdit : isEdit?isEdit:null});
}

function renderUserList(err, _userList, res){
      res.render('usersList', {title : 'User List', userList : _userList,error : err});
}
