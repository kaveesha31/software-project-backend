const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const facebookLocalStratergy = require('passport-facebook-token');
const config = require('../config/config.socialLogin');

var User = mongoose.model('User');
var FBuser = mongoose.model('FBuser');

passport.use(
    new localStrategy({ usernameField: 'userName' },
        (username, password, done) => {
            User.findOne({ userName: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Username is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // profile activation = false 
                      else if (!user.active)
                       return done(null, false, { message: 'Your profile should be activated' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

passport.use(
    'facebookToken', new facebookLocalStratergy({
        clientID : config.oauth.facebook.clientID,
        clientSecret : config.oauth.facebook.clientSecret
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try{
            console.log('accessToken', accessToken);
            console.log('refreshToken', refreshToken);
            console.log('profile', profile);

            const existingUser = await FBuser.findOne({ "facebook.id" : profile.id });
            if(existingUser){
                return done(null, existingUser);
            }

            const newUser = new FBuser({
                facebook : {
                    id : profile.id,
                    last_name : profile.last_name,
                    first_name : profile.first_name,
                    email : profile.emails[0].value
                }
            });

            newUser.save();

        } catch(err) {
            done(error, false, error.message);
        }
    })
);

