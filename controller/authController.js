const catchError=require('../utility/catchError')
// const appError=require('../utility/appError')
const User=require('../model/userModel')
const jwt=require('jsonwebtoken')
const AppError = require('../utility/appError')
const bcrypt=require('bcrypt')

const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}

const signup=catchError(async (req,res)=>{
   const user=await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm
   })

  const token=createToken(user._id)

   res.status(200).json({
    status:"success",
    token:token,
    data:user,
   })



})

const login=catchError(async(req,res,next)=>{
   //1 email bilan password borligini kiriting
   const {email,password}={...req.body}

   if(!email || !password){
      return next(new AppError('email va password ni kiriting ! Xato !!!',401))
   }
   //2 shunaqa odam bormi yoqmi tekshirish
   const user=await User.findOne({email})
   if(!user){
      return next(new AppError('bunday user mavjud emas. Royhatdan otin!',404))
   }
   //3 password to'g'rilini tekshirish
   const tekshirishHashga=async(oddiy,hashlangan)=>{
      return await bcrypt.compare(oddiy,hashlangan);
   }
   if(!tekshirishHashga){
     return next(new AppError('Sizning parolingiz xato! Iltimos qayta urinib koring',401))
   }
   //4 JWT token berish

   const token=createToken(user._id)
   //5 response qaytarish
   res.status(200).json({
      status:'success',
      token:token
   })
})

module.exports={signup,login}