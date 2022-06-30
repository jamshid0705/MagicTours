const express=require('express')

const User=require('../controller/userController')
const auth=require('../controller/authController')

const userRouter=express.Router()

// userRouter.param("id",User.chekId)  // middleware
userRouter.route('/signup').post(auth.signup)
userRouter.route('/signin').post(auth.login)

userRouter.route('/').get(auth.protect,User.getAllUsers).post(User.addUsers).get(auth.getAllUser)
userRouter.route('/:id').patch(User.updateUsers).get(User.getIdUsers).delete(User.deleteUsers)

module.exports=userRouter