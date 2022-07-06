const express=require('express')

const User=require('../controller/userController')
const auth=require('../controller/authController')

const retLimit=require('express-rate-limit')

const r=retLimit({
  max:2,
  windowMs:5000,

})
const userRouter=express.Router()

// userRouter.param("id",User.chekId)  // middleware
userRouter.route('/signup').post(auth.signup)
userRouter.route('/signin').post(auth.login)

userRouter.route('/forgotpassword').post(auth.forgotpassword)
userRouter.route('/resentpassword/:token').post(auth.resentpassword)

userRouter.route('/').get(r,User.getAllUsers).post(auth.protect,User.addUsers)
userRouter.route('/:id').patch(auth.protect,User.updateUsers).get(auth.protect,User.getIdUsers).delete(auth.protect,auth.role(['admin']),User.deleteUsers)

module.exports=userRouter