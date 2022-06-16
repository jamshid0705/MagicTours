// const fs=require('fs')
const Tour = require('../model/tourModel')

// console.log(typeof fs.readFileSync('./dev-data/data/tours-simple.json',"utf-8"))
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,"utf-8"))

// middleware
// const chekId=(req,res,next,val)=>{
//   if(val>tours.length){
//     return  res.status(201).json({
//       status:"success",
//       message:"topilmadi"
//     })
//   }
//   next()
// }

// const checkBody=(req,res,next)=>{
//   if(!req.name || !req.price){
//    return res.status(404).json({
//      status:"fail",
//      data:"Siz name bn price ni unitdingzi"
//    })
//   }
//   next()
// }


/// get
const getAllTour=async (req,res)=>{
  try{
    const tour=await Tour.find()  // Tour.find({name:jamshid}) name faqat jamshid bo'lgan obektlarni olib keladi
    res.status(200).json({
      status:"success",
      data:tour
    })
  } catch(err){
    res.status(404).json({
      status:"fail",
      message:err.message
    })
  }
}
// get id 
const getIdTour=async (req,res)=>{
  try{
    const data=await Tour.findById(req.params.id)

    res.status(200).json({
      status:"success",
      data:data
    })
  } catch(err){
    res.status(404).json({
      status:"fail",
      message:err.message
    })
  }

}

// post 

const addTour=async (req,res)=>{
  try{
    const data=req.body;
    const tour=await Tour.create(data)
  
    res.status(201).json({
      status:'success',
      data:tour
    })
  } catch(err){
    res.status(404).json({
      status:"fail",
      message:err.message
    })
  }
  
}

// patch
const updateTour=async (req,res)=>{
  try{
    const data=await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true});

    res.status(200).json({
      status:"success",
      data:data,
    })

  } catch(err){
    res.status(404).json({
      status:"fail",
      message:err.message
    })
  }
  
}

//delete
const deleteTour=async (req,res)=>{
  try{
    const data=await Tour.findByIdAndDelete(req.params.id)
    res.status(200).json({
      status:"success",
      data:data,
    })


  } catch(err){
    res.status(404).json({
      status:"fail",
      message:err.message
    })
  }
  

}


// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllTour,getIdTour,updateTour,deleteTour,addTour}
