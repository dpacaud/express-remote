var UserProvider = require('../providers/user-providers.js').UserProvider;


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

exports.getUserList = function(req,res) {
	userProvider.findAll(res , renderUserList);
}

exports.getUser = function(req,res) {
  userProvider.findById(req.params.tata, res, renderUser);
}

function renderUser(err, _user, res){
    //if(err)
    //  res.render('user', {title : 'User Profile', user : null, error : err });
    //else
      res.render('user', {title : 'User Profile', user : _user, error : err});
}

function renderUserList(err, _userList, res){
  if(err)
        res.send("error");
    else
      res.render('usersList', {title : 'User List', userList : _userList});
}
