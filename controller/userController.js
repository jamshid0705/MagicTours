const fs=require('fs')

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
const getAllUsers=(req,res)=>{
  res.status(200).json({  // faylni json formatda qaytaradi
    status:'success',
    results:users.length,
    data:users
  })
}
// get id 
const getIdUsers=(req,res)=>{
  const id=+req.params.id;
  const data=users.find(val=>val.id===id)
  if(data){
      res.status(200).json({  // faylni json formatda qaytaradi
      status:'success',
      data:data
    })
  }
}

// post 

const addUsers=(req,res)=>{
  const data=req.body;
  const id=users[users.length-1].id+1;
  const newUsers=Object.assign({id:id},data)
  users.push(newUsers);
  console.log(users)

  fs.writeFile(`${__dirname}/../dev-data/data/users.json`,JSON.stringify(users),err=>{
    res.status(201).json({
      status:"success",
      data:newUsers
    })
  })
}

// patch
const updateUsers=(req,res)=>{
  const id=req.params.id
  if(id>users.length){
    return  res.status(201).json({
      status:"success",
      message:"topilmadi"
    })
  }
}

//delete
const deleteUsers=(req,res)=>{
  const id=req.params.id
  if(id>users.length){
    return  res.status(201).json({
      status:"success",
      message:"topilmadi"
    })
  }
}


// app.get('/api/v1/tours',getAllTour)
// app.get("/api/v1/tours/:id",getIdTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
// app.post("/api/v1/tours",addTour)

module.exports={getAllUsers,getIdUsers,updateUsers,deleteUsers,addUsers}
