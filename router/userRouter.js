const express=require('express')

const User=require('../controller/userController')
const auth=require('../controller/authController')

const userRouter=express.Router()

// userRouter.param("id",User.chekId)  // middleware
userRouter.route('/signup').post(auth.signup)

userRouter.route('/').get(User.getAllUsers).post(User.addUsers)
userRouter.route('/:id').patch(User.updateUsers).get(User.getIdUsers).delete(User.deleteUsers)

module.exports=userRouter