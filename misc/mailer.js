//  const nodemailer = require('nodemailer');
//  const config = require('../config/mailer.config');

// let transport = nodemailer.createTransport({
//     service : 'smtp.gmail.com',
//     port: 587,
//     auth : {
//         user : config.USER,
//         password : config.PASSWORD
//     },
//     tls : {
//         rejectUnauthorized : false
//     }
// });

// let mailoptions = {
//     from : 'crental831@gmail.com',
//     to : 'kaveesha.rathnaka@gmail.com',
//     subject : 'profile activation',
//     text : 'copy this code'
// };

//         transport.sendMail(mailoptions, (err, data) => {
//             if (err) {
//                 console.log('error occurs');
//             } else {
//                 console.log('email sent');
//             }
//         })



// // let transport = nodemailer.createTransport({
// //     service : 'gmail',
// //     auth : {
// //         user : config.USER,
// //         password : config.PASSWORD
// //     },
// //     tls : {
// //         rejectUnauthorized : false
// //     }
// // });

// // module.exports.sendEmail = (from,subject,to,msg) =>{
// //         transport.sendMail({ from, subject, to, msg}, (err, info) => {
// //             if(err){
// //                 console.log(err);
// //             }
// //             else{
// //                 console.log(info);
// //             }
// //     })
// // }