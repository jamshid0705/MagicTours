const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const crypto=require('crypto')

const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Siz kirtishingiz shart'],
    trim:true,
  },
  email:{
    type:String,
    required:[true,'Siz email kiriting'],
    lowercase:true,
    unique:true,
    validate:{validator:function(val){
      return validator.isEmail(val)
    },message:'Siz togri email kiriting'}
  },
  role:{
    type:String,
    enum:['user','guide','team-lead','admin'],
    default:'user',
  },
  password:{
    type:String,
    required:[true,'Siz password kiriting'],
    minlength:[8,'8tadan kam bolmasligi kk'],
    validate:{validator:function(val){
      return validator.isStrongPassword(val)
    },message:"Siz kuchliroq parol kiriting"}
  },
  passwordConfirm:{
    type:String,
    required:[true,'Siz password kiriting'],
    minlength:[8,'8tadan kam bolmasligi kk'],
    validate:{validator:function(val){
      return this.password==val
    },message:"Siz bir xil parol kiriting"} ,
    select:false
  },
  passwordChangedDate:{
    type:Date,
    default:new Date()
  },
  resetTokenHash:String,
  resetTokenVaqt:String,

})

/////////////// password save middleware ///////////

UserSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    return next()
  }

  const hashpassword=await bcrypt.hash(this.password,13)
  this.password=hashpassword,
  this.passwordConfirm=undefined

  next()
})

//////////////////// reset token /////////////////

UserSchema.methods.resetHashToken=function(){
  const token=crypto.randomBytes(32).toString('hex')

  const tokenHash=crypto.createHash('sha256').update(token).digest('hex')

  this.resetTokenHash=tokenHash
  this.resetTokenVaqt=Date.now()+10*60*1000;

  return token;

}

const User=mongoose.model('users',UserSchema)

module.exports=User