const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const config = require('../config/mailer.config');
const mailer = require('../misc/mailer');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const randomString = require('randomstring');

//user registration
module.exports.register = (req, res, next) => {
    var user = new User();
    console.log(req.body)
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.userName = req.body.userName;
    user.password = req.body.password;
    user.city = req.body.city;
    user.contactNumber = req.body.contactNumber;
    user.save((err, doc) => {
        if (!err) {
            mailer.sendEmail(
                'crental831@gmail.com',
                'Welcome to CarRental',
                doc.email,
                'Please copy and paste following code to out application to verify your account. Code : ' + doc.randomCode
            )
            console.log('doc')
            res.send(doc);
        } else {
            console.log(err);
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                // return next(err);
                res.send('all the fields should be filled');
        }
        console.log('hello');
    })
}

module.exports.getEmail = (req, res) => {
    User.findOne({ email: req.body.email }, (err, doc) => {
        if (err) res.json(err)
        else
            mailer.sendEmail(
                'crental831@gmail.com',
                'Welcome to CarRental',
                doc.email,
                'Please copy and paste following url to reset account password. URL : http://localhost:4200/reset-password?code=' + encodeURIComponent(doc.randomCode)
            )
        console.log('doc')
        res.send(doc);
    });
}

module.exports.resetPassword = (req, res) => {
    console.log(decodeURIComponent(req.body.code))
    User.findOne({ randomCode: req.body.code }, (err, doc) => {
        if (err || !doc) res.status(500).json(err)
        else {
            doc.password = req.body.password;
            doc.save((err, val) => {
                res.json(val);
            })
        }
    })
}

//authentication for login
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) {
            console.log(user)
            return res.status(200).json({
                "token": jwt.sign({
                    _id: user._id, role: user.role, isactivate: user.isactivate
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXP
                    })
            });
        }
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

//user profile
module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['firstName', 'lastName', 'userName', 'email', 'city', 'contactNumber', 'role', 'image']) });
        }
    );
}

module.exports.getUserById = (req, res, next) => {
    User.findOne({ _id: req.params.id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['firstName', 'lastName', 'userName', 'email', 'city', 'contactNumber', 'role', 'image']) });
        }
    );
}

//facebook login
module.exports.facebookLogin = (req, res, next) => {
    console.log('got here');
    console.log('req.user', req.user);
},

    //verify account
    module.exports.verifyAccount = (req, res, next) => {
        // const randomCode = req.body.randomCode;
        // console.log(randomCode);
        console.log(req.body.randomCode);

        User.findOne({ randomCode: req.body.randomCode }, (err, user) => {
            console.log(err);
            console.log(user);
            if (!user) {
                return res.status(404).json({ status: false, message: 'User record not found.' });
            } else {

                user.active = true;
                User.findOneAndUpdate({ randomCode: req.body.randomCode }, { active: 'true' }, function (err, user) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(`new user ${user}`)
                    res.status(200).json({ status: true, message: 'User record found.' });
                })

                //user.save(user.active);

            }
        });
    }

//display user
module.exports.displayUsers = (req, res, next) => {
    User.find({
        active: true,
        role: {
            $ne: "admin"
        }
    }, (err, user) => {
        if (err) {
            consolele.log('error');
        }
        else {
            res.json(user)
        }
    });
}

//delete user by admin side
module.exports.deleteUser = (req, res, next) => {
    User.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            active: false
        }
    }, function (err, user) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
}


//edit user profile
module.exports.editUserProfile = (req, res, next) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        res.json(user);
        console.log('user profile edit works');
    });
}

module.exports.updateImage = (req, res) => {
    console.log('upload called')
    const url = req.protocol + '://' + req.get('host')
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            image: url + '/public/' + req.file.filename
        }
    }, (err, data) => {
        if (err) res.json(err)
        else res.json(data)
    })
}

//update user profile 
module.exports.updateUserProfile = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            contactNumber: req.body.contactNumber,
        }
    },
        {
            new: true
        },
        function (err, doc) {
            if (err) {
                res.send('error on updating');
            } else {
                res.json(doc);
            }
        }
    );
}
