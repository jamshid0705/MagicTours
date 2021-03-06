const express=require('express')

const User=require('../controller/userController')
const auth=require('../controller/authController')

const userRouter=express.Router()

// userRouter.param("id",User.chekId)  // middleware
userRouter.route('/signup').post(auth.signup)
userRouter.route('/signin').post(auth.login)

userRouter.route('/forgotpassword').post(auth.forgotpassword)
userRouter.route('/resentpassword/:token').post(auth.resentpassword)

userRouter.route('/updatemepassword').patch(auth.protect,User.updatemepassword)
userRouter.route('/updateMeData').patch(auth.protect,User.updateMe)

userRouter.route('/').get(User.getAllUsers).post(auth.protect,User.addUsers)
userRouter.route('/:id').patch(auth.protect,User.updateUsers).get(auth.protect,User.getIdUsers).delete(auth.protect,auth.role(['admin']),User.deleteUsers)

module.exports=userRouter