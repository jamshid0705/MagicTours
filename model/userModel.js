const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  name:String,
  surname:String,
  password:Number
})

const User=mongoose.model("users",userSchema);

module.exports=User