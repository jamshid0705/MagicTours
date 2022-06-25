const catchError=require('../utility/catchError')
// const appError=require('../utility/appError')
const User=require('../model/userModel')

const signup=catchError(async (req,res)=>{
   const user=await User.create(req.body)

   res.status(200).json({
    status:"success",
    data:user,
   })
})

module.exports={signup}