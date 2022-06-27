
const appError=require('./appError')

const catchError=function(funksiya){
  const middleFunc=(req,res,next)=>{   // controllerda shunday middleware yozsak boladi
    funksiya(req,res,next).catch(err=>next(new appError(err.message,404)))
  }
  return middleFunc
}

module.exports=catchError