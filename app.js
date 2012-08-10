
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var UserProvider = require('./providers/user-providers.js').UserProvider;
var userProvider = new UserProvider('127.0.0.1', 27017, function(err){
  if(err)
      console.log(err);
    //else
      //userProvider.save({userName:'toto', _id:"toto@yopmail.com", age:50 }, function(){});
  }
);

// This function gets all the users from DB and returns them as a JSON array in the response
var getAllUsers = function(req, res){
  userProvider.findAll(function(err,users) {
    if(err)
      res.send("error");
    else
        res.send(users);
  }); 
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
  //app.get('/', function(req, res) {
  
  //});


// This is where we will handle Get request on a user ID
  app.get('/user/serty2',function(req,res){
    userProvider.findById('serty2@gmail.com', function(err,user){
      if(err)
        res.send("erorr");
      else
          res.send(user);
    });
  });

  app.get('/users',getAllUsers);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




