const mongoose=require('mongoose')
const fs=require("fs")
const Tour=require('../../model/tourModel')
// const User=require('../../model/userModel')
const { config } = require('process')

const tour=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))
const user=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))

const data=mongoose.connect('mongodb+srv://jamshid:jam0705@startmagic.vevoy.mongodb.net/magic?retryWrites=true&w=majority',{})
 .then(()=>{
   console.log("Databasega ulanish hosil qilidi .... ")
 }).catch((err)=>{
  console.log(err.message)
 })

 const addJson=async ()=>{
  try{
    await Tour.create(tour)
    // await User.create(user)
    console.log("Databasega malumotlar saqlandi ")

  }catch(err){
    console.log(err)
  }
 }

 const deleteJson=async ()=>{
  try{
    await Tour.deleteMany()
    // await User.deleteMany()
    console.log("Database tozalandi ..")
    process.exit()
  } catch(err){
    console.log(err)
  }
 }

 if(process.argv[2]==='--add'){
  addJson()
 }
 if(process.argv[2]==='--delete'){
  deleteJson()
 }