const catchError=require('../utility/catchError')
// const appError=require('../utility/appError')
const User=require('../model/userModel')
const jwt=require('jsonwebtoken')
const AppError = require('../utility/appError')
const bcrypt=require('bcrypt')
const mail=require('./../utility/mail')
const crypto=require('crypto')


/////////// create token ///////////////
const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
}

// ////// find get ALL user ///////
// const getAllUser=catchError(async(req,res)=>{
//    const data=await User.find()

//    res.status(200).json({
//       status:'success',
//       data:data
//    })
// })

///// create add user ////////////

//////////////// sign up ////////////////

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


///////////////////// SIGN IN //////////////////////

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
      return next(new AppError('Siz royhatdan otishingiz kk. Bunday user mavjud emas !',404))
   }
   // 2 token ni tekshirish Serverniki bn Clientnikini tekshirish

   const tokencha=jwt.verify(token,process.env.JWT_SECRET)

   // 3 token ichidan idni olib databasedagi id bn tekshirish

   // console.log(tokencha)
   const user=await User.findOne({_id:tokencha.id})
   console.log(user)
   if(!user){
      return next(new AppError('Bunday user mavjud emas iltimos ro\'yhatdan o\'tin !',404))
   }

   // 4 agar parol o'zgargan bo'lsa tokenning amal qilmasligini tekshirish

   if(user.passwordChangedDate){ 
      console.log(tokencha.iat)
      console.log(user.passwordChangedDate.getTime()/1000)
      if(user.passwordChangedDate.getTime()/1000>tokencha.iat){
         return next(new AppError('Sizning tokeningiz yaroqsiz. Iltimos yangi token bn kiring !',404))
      }
   }


   req.user=user
   
   next()
})

///////////// role /////////////////

const role=(roles)=>{
   return catchError(async(req,res,next)=>{
      if(!roles.includes(req.user.role)){
         return next(new AppError('Siz kirish huquqiga ega emassiz !',404))
      }
      next()
   })
}


///////////////// forgot Password ///////////////// Agar user parolini unitgan bo'lsa . Email orqali kirib parolini yangilash

const forgotpassword=catchError(async(req,res,next)=>{
   //1 email bor yoqligini tekshiramiz

   if(!req.body.email){
      return next(new AppError('Siz email kiritishingiz shart',404))
   }
   //2 emailli user bor yoqligini tekshiramiz

   const user=await User.findOne({email:req.body.email})

   if(!user){
      return next(new AppError('Bunday email mavjud emas iltimos email kiriting !',404))
   }

   //3 yangi tokencha yaratamiz
   const token=user.resetHashToken()

   console.log('222222',token)
   await user.save({validateBeforeSave:false})

   //4 emailga jo'natamiz tokenchani

   const resetLink=`${req.protocol}://${req.get('host')}/api/v1/users/resentpassword/${token}`
   const subject="Reset password qilish uchun link !"
   const html=`<h2>Reset password qilish uchun quyidagi tugmani bosing 👉<a style='color:red' href=${resetLink}>Reset Link</a></h2>`
   const to='jamshidshamshod0705@gmail.com'


   await mail({to,subject,html})

   res.status(200).json({
      status:'success',
      data:user
   })

   next()
})

///////////////// Reset Token ////////////////

const resentpassword=catchError(async (req,res,next)=>{
   // 1 token olamiz
   const token =req.params.token
 
   const tokenHash=crypto.createHash('sha256').update(token).digest('hex')

   // 2 token to'g'ri noto'g'riligini va vaqti o'tib ketmaganligini tekshiradi
   

   const user=await User.findOne({
      resetTokenHash:tokenHash,
      resetTokenVaqt:{$gt:Date.now()}
   })
 
   if(!user){
      user.resetTokenHash=undefined
      user.resetTokenVaqt=undefined

      return next(new AppError('Token xato !',404))
   }
   // 3 yangi passwordni saqlaymiz

   if(!req.body.password || !req.body.passwordConfirm){
      return next(new AppError('Password yoki passwordConfirm kiritilmagan',404))
   }

   if(!(req.body.password===req.body.passwordConfirm)){
      return next(new AppError('Siz bir xil parol kiritishingiz kerak',404))
   }

   user.password=req.body.password
   user.passwordConfirm=req.body.passwordConfirm
   user.passwordChangedDate=Date.now()

   console.log(user.resetTokenHash)
   // user.resetTokenHash=undefined
   // user.resetTokenVaqt=undefined

   await user.save()

   // 4 JWT token berish yangi
   const tokenJWT=createToken(user._id)

   res.status(200).json({
      status:'success',
      token:tokenJWT
   })

   next()

})

module.exports={signup,login,protect,role,forgotpassword,resentpassword}