const mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'username cannot be empty',
    },
    email: {
        type: String,
        required: 'email cannot be empty'
    },
    subject: {
        type: String,
        required: 'subject cannot be empty'
    },
}, {
    collection: 'feedback'
});

mongoose.model('Feedback', feedbackSchema);