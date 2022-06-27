
const dotenv=require('dotenv')  // globalni o'zgaruvchilarga saqlash
dotenv.config({path:'./config.env'})
const app=require('./app')
const mongoose=require('mongoose')
const tourRouter = require('./router/tourRouter')

const data=process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD)


// rejection
process.on('unhandledRejection',err=>{
  console.log("Error: ",err.name,"Error message: ",err.message)
})
// expections
process.on('uncaughtException',(err)=>{
  console.log("Error: ",err.name,"Error message: ",err.message)
})


console.log('assds')
mongoose.connect(data,{}).then(()=>{
  console.log("Databasega ulandi")
})
.catch((err)=>{
  console.log(err)
})

app.listen(+process.env.PORT,process.env.URL,()=>{
  console.log('ulandingiz')
})


// schema
