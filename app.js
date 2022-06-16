const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')

const app=express();


// midleware
app.use(express.json())
// route
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)  // middleware

app.listen(8000,'127.0.0.2',()=>{
  console.log('ulandingiz')
})