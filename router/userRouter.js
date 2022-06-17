const express=require('express')

const User=require('../controller/userController')

const userRouter=express.Router()

// userRouter.param("id",User.chekId)

userRouter.route('/').get(User.getAllUsers).post(User.addUsers)
userRouter.route('/:id').get(User.updateUsers).patch(User.getIdUsers).delete(User.deleteUsers)

module.exports=userRouter