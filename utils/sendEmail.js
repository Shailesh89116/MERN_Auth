const nodemailer=require("nodemailer");

const sendEmail=(options)=>{
    const transporter=nodemailer.createTransport({
        service : process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        },
        port : 465,
        host : 'smtp.gmail.com'
    })

    const mailOptions={
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html:options.text
    }

    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
    })
}

// module.exports=sendEmail;


// const sgMail = require('@sendgrid/mail');

// const sendEmail=(options)=>{
//     sgMail.setApiKey(process.env.EMAIL_PASSWORD);
//     const msg = {
//         from: process.env.EMAIL_FROM,
//         to: options.to,
//         subject: options.subject,
//         html:options.text
//     };
//     //ES6
//     sgMail
//       .send(msg)
//       .then(() => {}, error => {
//         console.error(error);
    
//         if (error.response) {
//           console.error(error.response.body)
//         }
//       });
//     //ES8
//     (async () => {
//       try {
//         await sgMail.send(msg);
//       } catch (error) {
//         console.error(error);
    
//         if (error.response) {
//           console.error(error.response.body)
//         }
//       }
//     })();
// }


module.exports=sendEmail;