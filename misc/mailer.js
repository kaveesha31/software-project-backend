const nodemailer = require('nodemailer');
const config = require('../config/mailer.config');

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.USER,
        pass: config.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailoptions = {
    from: 'crental831@gmail.com',
    to: 'acpasavarjana@gmail.com',
    subject: 'profile activation',
    text: 'copy this code'
};

module.exports.mail = () => transport.sendMail(mailoptions, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('email sent');
    }
})



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

module.exports.sendEmail = (from, subject, to, text) => {
    transport.sendMail({ from: from, subject: subject, to: to, text: text }, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    })
}