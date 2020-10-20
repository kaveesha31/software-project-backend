const mongoose = require('mongoose');

const Feedback = mongoose.model('Feedback');

//add vehicle
module.exports.feedback = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')

    console.log(req.file)
    var feedback = new Feedback();
    feedback.username = req.body.username;
    feedback.email = req.body.email;
    feedback.subject = req.body.subject;
    feedback.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate registration number found.']);
            else
                // return next(err);
                res.send('all the fields should be filled');
        }
    });
}

//display user
module.exports.displayFeedback = (req, res, next) => {
    Feedback.find((err, vehicle) => {
        if (err) {
            consolele.log('error');
        }
        else {
            res.json(vehicle)
        }
    });
}

//delete user by admin side
module.exports.deleteFeedback = (req, res, next) => {
    Feedback.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            active: false
        }
    }, function (err, user) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
}

module.exports.getFeedbackById = (req, res, next) => {
    Feedback.findOne({ _id: req.params.id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'feedback record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['username', 'email', 'subject']) });
        }
    );
}