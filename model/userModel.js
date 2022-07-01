const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

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
    },message:"Siz bir xil parol kiriting"} 
  },
  passwordChangedDate:{
    type:Date,
    default:new Date()
  }

})

UserSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    return next()
  }

  const hashpassword=await bcrypt.hash(this.password,13)
  this.password=hashpassword,
  this.passwordConfirm=undefined

  next()
})


const User=mongoose.model('users',UserSchema)

module.exports=User