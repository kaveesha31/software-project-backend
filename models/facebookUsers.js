const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomString =  require('randomstring');
const crypto = require('crypto');
const nanoid = require('nanoid');

var facebookUserSchema = new mongoose.Schema({
      facebook: {
        id: {
          type: String
        },
        last_name: {
            type: String,
          },
          first_name: {
            type: String,
          },
        email: {
          type: String,
          lowercase: true
        }
      }
    })

mongoose.model('FBuser', facebookUserSchema);