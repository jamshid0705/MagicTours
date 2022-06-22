const mongoose=require('mongoose')

const tourSchema=new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nameni kiriting'],
  },
  price: {
    type: Number,
    required: true,
    validate:{validator:function(val){
      if(val>1)
      return true;
       return false;
    },message:"Siz 0 dan katta qiymat kiritishingiz kk"}
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,

    enum:{values:['difficulty','easy','medium'],message:'Siz mavjud bolmagan qiymat kiritdingiz'}
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
  },
  images:  [String],
  startDates: [Date],
  
  createAt: {
    type: Date,
    default: Date.now(),
  },
},
{ ////////////////// bu usl bn biz userga qoshimcha malumot qoshib berolamiz
  toJSON:{virtuals:true},
  // toObject:{virtuals:true}
})

tourSchema.virtual('chegirma').get(function(){
  // console.log(this)
  return this.price*0.2
})

tourSchema.virtual('chegirmadanKeyingiNarx').get(function(){
  return this.price-this.chegirma
})

/////////////////// Document middlaware ///////////////

tourSchema.pre('save',function(next){
  this.name=this.name+' Xatamov Jamshid',
  next()
})

tourSchema.post('save',function(doc,next){
  this.name=this.name+"jam";
  next()
})

/////////////////// Query midlleware///////////////////

tourSchema.pre('find',function(next){
  this.find({price:{$lte:997}})
  next()
})

tourSchema.post('find',function(doc,next){
  // this.find({price:{$lte:400}})
  // console.log(doc)
  next()
})




const Tour=mongoose.model("tours",tourSchema)

module.exports=Tour