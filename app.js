const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')

const app=express();


// midleware
app.use(express.json())

app.use(express.static('public'))  // html fayllarini oqish un
// route
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)  // middleware

module.exports=app
// console.log(process.env)