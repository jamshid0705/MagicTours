// const fs=require('fs')
const Tour = require('../model/tourModel')

const FeatureApi=require('./../utility/featureApi')

const appError=require('../utility/appError')

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

const catchError=function(funksiya){
  const middleFunc=(req,res,next)=>{
    funksiya(req,res).catch(err=>next(new appError(err.message,404)))
  }
  return middleFunc
}





const getAllTour=catchError(async (req,res)=>{
  
   const query=new FeatureApi(req.query,Tour).filter().sort().field().page()
   const tours= query.databaseQuery
    const data=await tours

    // Tour.find({name:jamshid}) name faqat jamshid bo'lgan obektlarni olib keladi
    res.status(200).json({
      status:"success",
      data:data1
    })
  
}
)



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

/////////////////// aggregate /////////////////////////////////////////
const tourStatus=async (req,res)=>{
  try{
    const data=await Tour.aggregate([
      {$match:{duration:{$gte:1}}},
      {$group:{_id:"$difficulty",
      numberTours:{$sum:1},
      ortachaNarx:{$avg:'$price'},
      engArzonNarx:{$min:"$price"},
      engQimmatNarx:{$max:"$price"},
      ortachaReyting:{$avg:"$ratingsAverage"}
    }},
    {$sort:{engArzonNarx:-1}},
    {$project:{_id:0}}  // olib tashlash un
    ])
    res.status(200).json({
      status:'success',
      results:data.length,
      data:data
    })
  } catch(err){
    res.status(404).json({
      status:'fail',
      data:err.message
    })
  }
}



const tourReportYear=async (req,res)=>{
  try{
    const data=await Tour.aggregate([
      {
       $unwind:"$startDates",
      },
      {
        $match:{startDates:{$gte:new Date(`${req.params.year}-01-01`),$lte:new Date(`${req.params.year}-12-31`)}}
      },
      {$group:{
        _id:{$month:'$startDates'},
        tourlarSoni:{$sum:1},
        tourNomi:{$push:'$name'}
      }},
      {$addFields:{qaysiOyligi:'$_id'}},
      {$project:{_id:0}},
      {$sort:{tourlarSoni:-1}},
      {$limit:3}
    ])

    res.status(200).json({
      status:'success',
      results:data.length,
      data:data
    })


  } catch(err){
    res.status(404).json({
      status:'fail',
      data:err.message
    })
  }
}
// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllTour,getIdTour,updateTour,deleteTour,addTour,tourStatus,tourReportYear}
