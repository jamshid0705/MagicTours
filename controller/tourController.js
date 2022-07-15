// const fs=require('fs')
const Tour = require('../model/tourModel')

const FeatureApi=require('./../utility/featureApi')

const catchError=require('../utility/catchError')

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







const getAllTour=catchError(async (req,res)=>{
  
   const query=new FeatureApi(req.query,Tour).filter().sort().field().page()
   const tours= query.databaseQuery
    const data=await tours

    // Tour.find({name:jamshid}) name faqat jamshid bo'lgan obektlarni olib keladi
    res.status(200).json({
      status:"success",
      data:data
    })
  
}
)



// get id 
const getIdTour=catchError(async (req,res)=>{
  
    const data=await Tour.findById(req.params.id).populate({
      path:'guides',
      select:'-__v -_id'
    })
    if(!data){
      throw new Error('Bunaqa id lik malumot topilmadi ... ')
    }
    res.status(200).json({
      status:"success",
      data:data
    })
 

})

// post 

const addTour=catchError(async (req,res)=>{
  
    const data=req.body;
    const tour=await Tour.create(data)
  
    res.status(201).json({
      status:'success',
      data:tour
    })
  
  
})

// patch
const updateTour=catchError(async (req,res)=>{
  
    const data=await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true});

    res.status(200).json({
      status:"success",
      data:data,
    })

 
  
})

//delete
const deleteTour=catchError(async (req,res)=>{
  
    const data=await Tour.findByIdAndDelete(req.params.id)
    if(!data){
      throw new Error('Bunaqa id lik malumot topilmadi ... ')
    }
    res.status(200).json({
      status:"success",
      data:data,
    })

})

/////////////////// aggregate /////////////////////////////////////////
const tourStatus=catchError(async (req,res)=>{
  
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
  
})



const tourReportYear=catchError(async (req,res)=>{
  
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


 
})
// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllTour,getIdTour,updateTour,deleteTour,addTour,tourStatus,tourReportYear}
