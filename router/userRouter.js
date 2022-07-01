const express=require('express')

const User=require('../controller/userController')
const auth=require('../controller/authController')

const userRouter=express.Router()

// userRouter.param("id",User.chekId)  // middleware
userRouter.route('/signup').post(auth.signup)
userRouter.route('/signin').post(auth.login)

userRouter.route('/').get(auth.protect,User.getAllUsers).post(auth.protect,User.addUsers)
userRouter.route('/:id').patch(auth.protect,User.updateUsers).get(auth.protect,User.getIdUsers).delete(auth.protect,User.deleteUsers)

module.exports=userRouter