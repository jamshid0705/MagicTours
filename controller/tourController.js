const fs=require('fs')

// console.log(typeof fs.readFileSync('./dev-data/data/tours-simple.json',"utf-8"))
const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,"utf-8"))

const chekId=(req,res,next,val)=>{
  if(val>tours.length){
    return  res.status(201).json({
      status:"success",
      message:"topilmadi"
    })
  }
  next()
}

/// get
const getAllTour=(req,res)=>{
  res.status(200).json({  // faylni json formatda qaytaradi
    status:'success',
    results:tours.length,
    data:tours
  })
}
// get id 
const getIdTour=(req,res)=>{
  const id=req.params.id;
  const data=tours.find(val=>val.id==id)
  if(data){
      res.status(200).json({  // faylni json formatda qaytaradi
      status:'success',
      data:data
    })
  }
}

// post 

const addTour=(req,res)=>{
  const data=req.body;
  const id=tours[tours.length-1].id+1;
  const newTour=Object.assign({id:id},data)
  tours.push(newTour);

  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
    res.status(201).json({
      status:"success",
      data:newTour
    })
  })
}

// patch
const updateTour=(req,res)=>{
  
}

//delete
const deleteTour=(req,res)=>{

}


// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllTour,getIdTour,updateTour,deleteTour,addTour,chekId}
