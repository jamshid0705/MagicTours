const fs=require('fs')
const User = require('../model/userModel')



// console.log(typeof fs.readFileSync('./dev-data/data/tours-simple.json',"utf-8"))
const users=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`,"utf-8"))

// const chekId=(req,res,next,val)=>{
//   if(users.length<val){
//     return res.status(404).json({
//       status:"fail",
//       data:"Error message"
//     })
//   }
//   next()
// }

/// get
const getAllUsers=async (req,res)=>{
  try{
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


// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllUsers,getIdUsers,updateUsers,deleteUsers,addUsers}
