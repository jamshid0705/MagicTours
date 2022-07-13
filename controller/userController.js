// const fs=require('fs')
const User = require('../model/userModel')
const AppError = require('../utility/appError')
const catchError=require('../utility/catchError')
const bcrypt=require('bcrypt')
const { createToken } = require('./authController')



// console.log(typeof fs.readFileSync('./dev-data/data/tours-simple.json',"utf-8"))
// const users=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`,"utf-8"))

// const chekId=(req,res,next,val)=>{
//   if(users.length<val){
//     return res.status(404).json({
//       status:"fail",
//       data:"Error message"
//     })
//   }
//   next()
// }

// const checkBody=(req,res,next)=>{
//   if(!req.body.name || !req.body.surname){
//     res.status(404).json({
//       status:"success",
//       data:"Siz name yoki role unitdingiz !"
//     })
//   }
//   next()
// }

/// get


const getAllUsers=async (req,res)=>{
  try{

    console.log(req.query)
    const data=await User.find()
    res.status(200).json({
      status:"success",
      data:data
    })

  } catch(err){
    res.status(200).json({
      status:"success",
      data:err.message
    })
    
  }

}
// get id 
const getIdUsers=async (req,res)=>{
  try{
    const data=await User.findById() 
    res.status(200).json({
      status:'success',
      data:data
    })

  } catch(err){
    res.status(200).json({
      status:"success",
      data:err.message
    })
    
  }
}

// post 

const addUsers=async (req,res)=>{
  try{
    const data=await User.create(req.body)
    res.status(200).json({
      status:"success",
      data:data
    })

  } catch(err){
    res.status(200).json({
      status:"success",
      data:err.message
    })
    
  }
}

//delete
const deleteUsers=async (req,res)=>{
  try{
    const data=await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
      status:'success',
      data:data
    })

  }catch(err){
    res.status(200).json({
      status:"success",
      data:err.message
    })
    
  }
 
}

const updateUsers=async (req,res)=>{
  try{
    const data=await User.findByIdAndUpdate(req.params.id,req,body,{new:true})
    res.status(200).json({
      status:'success',
      data:data
    })

  }catch(err){
    res.status(200).json({
      status:"success",
      data:err.message
    })
    
  }
}


///////// Update Password /////////

const updatemepassword=catchError(async (req,res,next)=>{
  // 1. Eski passwordni tekshirib ko'rish
    if(req.body.oldpassword===req.body.newpassword){
      return next(new AppError('Siz bir xil parol kiritdingiz!',401))
    }

    if(!req.body.oldpassword){
      return next(new AppError('Siz eski passwordni kirtiing !',401))
    }

    if(!(req.body.newpassword===req.body.newpasswordConfirm)){
      return next(new AppError('Siz bir xil parol kiriting',401))
    }

    const user=await User.findById(req.user.id).select('+password')

    const tekshir=await bcrypt.compare(req.body.oldpassword,user.password)

    if(!tekshir){
      return next(new AppError('Sizning parolingiz xato ! Bunday user mavjud emas !',401))
    }
  // 2. Yangi parolni saqlaymiz

  user.password=req.body.newpassword
  user.passwordChangedDate=Date.now()

  await user.save({validateBeforeSave:false})

  // 3.JWT beramiz

  const token=createToken(user._id)

  res.status(200).json({
    status:"saccess",
    data:token
  })
})

////////// Updateme /////////

const updateMe=catchError(async (req,res,next)=>{
  const user=await User.findById(req.user.id)

  user.name=req.body.name || user.name
  user.email=req.body.email || user.email
  user.photo=req.body.photo || user.photo

  const newuser=await user.save({validateBeforeSave:false})

  res.status(200).json({
    status:'success',
    data:newuser
  })
})

// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllUsers,getIdUsers,updateUsers,deleteUsers,addUsers,updatemepassword,updateMe}
