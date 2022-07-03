const nodemailer=require('nodemailer')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})

const mail=async (options)=>{
  // 1 tarnsport yaratamiz
  const tarnsport=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS

    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })

  // 2 mailerni nastroyka qilamiz
  const Maeloptions={
    from:options.from,
    to:options.to,
    subject:options.subject,
    text:options.text,
    html:options.html

  }

  // 3 mailerni jonatamiz

  return await tarnsport.sendMail(Maeloptions)
}

// mail({from:'jamshidshamshod0705@gmail.com',to:'jamshidxatamov0705@gmail.com',subject:'Xabar keldi',text:"Assalomu alaykum !!!"})

module.exports=mail