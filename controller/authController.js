const catchError=require('../utility/catchError')
// const appError=require('../utility/appError')
const User=require('../model/userModel')
const jwt=require('jsonwebtoken')
const AppError = require('../utility/appError')
const bcrypt=require('bcrypt')


/////////// create token ///////////////
const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}

////// find get ALL user ///////
const getAllUser=catchError(async(req,res)=>{
   const data=await User.find()

   res.status(200).json({
      status:'success',
      data:data
   })
})

///// create add user ////////////
const signup=catchError(async (req,res)=>{
   const user=await User.create({
      name:req.body.name,
      email:req.body.email,
      role:req.body.role,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm,
      passwordChangedDate:req.body.passwordChangedDate
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
   if(!(await tekshirishHashga(password,user.password))){
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


//////////// middleware //////////////

const protect=catchError(async (req,res,next)=>{
   // 1 token bor yoqligini tekshirish
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      // console.log(req.headers.authorization)
      token=req.headers.authorization.split(' ')[1]
      // console.log(token)
   }
   if(!token){
      return next(new AppError('Siz royhatdan otishingiz kk. Bunday user mavjud emas !'))
   }
   // 2 token ni tekshirish Serverniki bn Clientnikini tekshirish

   const tokencha=jwt.verify(token,process.env.JWT_SECRET)

   // 3 token ichidan idni olib databasedagi id bn tekshirish

   console.log(tokencha)
   const user=await User.findOne({_id:tokencha.id})
   console.log(user)
   if(!user){
      return next(new AppError('Bunday user mavjud emas iltimos ro\'yhatdan o\'tin !'))
   }

   // 4 agar parol o'zgargan bo'lsa tokenning amal qilmasligini tekshirish

   if(user.passwordChangedDate){
      if(user.passwordChangedDate.getTime()/1000>tokencha.iat){
         return next(new AppError('Sizning tokeningiz yaroqsiz. Iltimos yangi token bn kiring !'))
      }
   }


   
   next()
})

module.exports={signup,login,getAllUser,protect}