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
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.userName = req.body.userName;
    user.password = req.body.password;
    user.city = req.body.city;
    user.contactNumber = req.body.contactNumber;
    user.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                // return next(err);
                res.send('all the fields should be filled');
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
                return res.status(200).json({ status: true, user: _.pick(user, ['firstName', 'lastName', 'userName', 'email', 'city', 'contactNumber']) });
        }
    );
}

module.exports.getUserById = (req, res, next) => {
    User.findOne({ _id: req.params.id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['firstName', 'lastName', 'userName', 'email', 'city', 'contactNumber']) });
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
    User.find((err, user) => {
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
    User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
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
