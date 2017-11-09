var mongoose=require('mongoose');
var Schema =mongoose.Schema;
var userscheme=new Schema({
fname:String,lname:String,age:Number,weight:Number,height:Number,gender:String,email:String,contact:Number,gender:String,password:String,name:String,subject:String,message:String
});

var user=mongoose.model('user',userscheme,"register");
module.exports=user;
