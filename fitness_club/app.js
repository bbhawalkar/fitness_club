var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user=require('./model/user');
var nodemailer = require('nodemailer');
var morgan = require('morgan');
var app = express();
var session = require('express-session');
var crypto = require('crypto');
var http = require('http');
var randomstring = require("randomstring");
var requester = require("request");
var sessionUser;
//  BodyParsing
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
 // BodyParsing end

mongoose.connect('mongodb://localhost:27017/user_db');

app.use(morgan('dev'));
app.use(cookieParser());
app.use("/scripts",express.static(__dirname + '/scripts'));
app.use("/templates",express.static(__dirname + '/templates'));
app.use("/node_modules", express.static('node_modules'));
app.use("/model",express.static('model'));
app.use("/images",express.static(__dirname + '/images'));
app.use("/css",express.static(__dirname + '/css'));
app.use("/img",express.static(__dirname + '/img'));
app.use("/font",express.static(__dirname + '/font'));
app.use("/saas",express.static(__dirname + '/images'));
app.use("/js",express.static(__dirname + '/js'));

app.use(session({secret: "run fast"}));

var send_value;

app.listen(3000,function(){
  console.log('server listening');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/bmi', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/forgotpassword', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//
// app.get('/sample', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.");
   });
   res.redirect('/');
});

app.get('/fitness', checkSignIn, function(request, response){
  response.render('fitness', {id: request.session.user});
});

function checkSignIn(request, response){
   if(request.session.user){
      response.render('fitness', {id: request.session.user})     //If session exists, proceed to page
   }
   else {
      console.log("Not logged In");
      response.redirect('/');
   }
}

app.use('/fitness', function(err, request, response, next){
  console.log("redirecting back or send");
  response.redirect('/');
});

app.post('/fitness',function(request,response)
{
  user.findOne({ email: request.body.email}, function(err, user) {
        console.log('User found ');
        if(err) {
          console.log('THIS IS ERROR RESPONSE')
        }
        if (user.password === request.body.password){
          request.session.user = user.email;
          sessionUser = user.email;
          console.log('UserName and password is correct')
          response.sendFile(__dirname + '/templates/fitness.html');
        }
        else {
          response.status(401);
          response.redirect('/');
          console.log(user.password);
          console.log("Credentials wrong");
        }
 });
});

app.post('/register',function(request,response){
  var newObj=new user();
  newObj.fname=request.body.fname;
  newObj.lname=request.body.lname;
  newObj.email = request.body.email;
  newObj.contact = request.body.contact_no;
  newObj.password = request.body.password;
  newObj.age = request.body.age;
  newObj.weight = request.body.weight;
  newObj.height = request.body.height;
  newObj.gender = request.body.gender;
  newObj.save(function(err){
    if(err)
    response.send(err);
    else{
	    response.redirect('/');
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '7instructions@gmail.com',
          pass: 'pravin@123'
        }
      });

      var mailOptions = {
        from: '7instructions@gmail.com',
        to: request.body.email,
        subject: 'Account creation successful',
        text: 'Hi There! You have successfully registered with Fitness CLUB !!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }
);
});

app.post('/forgotpass',function(request,response)
{
  user.findOne({ email: request.body.email}, function(err, user) {
        console.log('User found ');
        if(err) {
          console.log('THIS IS ERROR RESPONSE')
        }
        else{
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: '7instructions@gmail.com',
              pass: 'pravin@123'
            }
          });

          var mailOptions = {
            from: '7instructions@gmail.com',
            to: request.body.email,
            subject: 'Your password',
            text: user.password
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          response.redirect('/');
        }
  });
});

app.get('/fitness/data',function(req,res){
  user.findOne({email : sessionUser}, function(err, data){
    var userObj = new Object();
    userObj.age = data.age;
    userObj.height = data.height;
    userObj.weight = data.weight;
    userObj.gender = data.gender;
	  console.log(userObj);
    res.send(userObj);
    });
});
