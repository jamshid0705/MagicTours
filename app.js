const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')
const reviewRouter=require('./router/reviewRouter')

const rateLimit=require('express-rate-limit') // so'rovlarga limit qo'yish
const helmet=require('helmet') // headerni secure tisini kuchaytirish
const sanitize=require('express-mongo-sanitize') // requestni securitisini kuchaytirish
const xss=require('xss-clean') // html ichiga virus tiqib yubormoqchi bo'lsa ushlab qoladi
// const bodyParser=require('body-parser')




const app=express();

const appError=require('./utility/appError')
const appErrorController=require('./controller/appErrorController')


// midleware
app.use(express.json())
const limit=rateLimit({
  max:3,
  windowMs:1*60*1000,
  message:"Siz juda ko'p so'rov yubordingiz !"
})

app.use('/api',limit)
app.use(helmet())
app.use(sanitize())

// app.use(express.bodyParser())
app.use(xss())



app.use(express.static('public'))  // html fayllarini oqish un
// route
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)  // middleware
app.use('/api/v1/reviews',reviewRouter)

app.all('*',function(req,res,next){
 
 next(new appError(`This is page not found ${req.originalUrl}`,404 ))
})


//////////////// Error middleware /////////////////////////

app.use(appErrorController)
module.exports=app
// console.log(process.env)