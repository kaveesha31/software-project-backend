const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomString =  require('randomstring');
const crypto = require('crypto');
const nanoid = require('nanoid');

var userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : 'First name cannot be empty'
    },
    lastName : {
        type : String,
        required : 'Last name cannot be empty'
    },
    email : {
        type : String,
        required : 'Email cannot be empty',
        unique : true
    },
    userName : {
        type : String,
        required : 'Username cannot be empty'
    },
    password : {
        type : String,
        required : 'Password cannot be empty',
        minlength : [6, 'Password should have at least 6 characters']
    },
    city : {
        type : String,
        required : 'City cannot be empty'
    },
    contactNumber : {
        type : Number,
        required : 'Contact Number cannot be empty'
    },
    role : {
        type : String,
        default : 'user'
    },
    active : {
        type : Boolean,
        default : false
    },
    // facebook: {
    //     id: {
    //       type: String
    //     },
    //     last_name: {
    //         type: String,
    //       },
    //       first_name: {
    //         type: String,
    //       },
    //     email: {
    //       type: String,
    //       lowercase: true
    //     }
    //   },
    randomCode : String,
    saltSecret : String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


//to generate the json web token 
userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

// random string
userSchema.pre('save', function(next){
    crypto.randomBytes(48, (ex, buf) => {
        token = buf.toString('base64');
        this.randomCode = token;
        next();
    });
});


mongoose.model('User', userSchema);