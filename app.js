
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

var userModel = require('./models/user');
var user = new userModel("ohohudzdzh","testName", "testFirstName");

user.presentations = [{name : 'Prez 1', content:'<html></html>', type:'impress'}]

var UserProvider = require('./providers/user-providers.js').UserProvider;

var userProvider = new UserProvider('127.0.0.1', 27017, function(err){
    if(err)
      console.log(err);
    else
      userProvider.save(user, null,function(err) {if(err) console.log(err);})
  }
);

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
//The add route has to be specified before the :id route
// Otherwise, we get an id == add ;)
app.get('/user/add', routes.addUser);
app.get('/user/:id' , routes.getUser);
app.get('/user/:id/edit' , routes.editUser);
app.get('/users' , routes.getUserList);

//For some reason, it is impossible to send a PUT from an HTML form
// So we deal with user creation with a POST action but it sucks
app.post('/user',routes.putUser);
app.post('/user/:id',routes.updateUser);

//Handling presentations Routes
app.post('/user/:id/presentation',routes.addPresentation);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
