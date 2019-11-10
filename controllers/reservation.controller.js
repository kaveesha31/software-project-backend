const mongoose = require('mongoose');

const Reservation = mongoose.model('Reservation');

//add reservation
module.exports.addReservation = (req, res, next) => {
    var reservation = new Reservation(req.body);
    reservation.save((err, doc) => {
        if (doc) {
            res.json(doc);
        } else {
            // return next(err);
            res.json(err);
        }
    });
}


module.exports.getReservationsByDate = async (from, to) => {
    return await Reservation.find(
        {
            $or: [
                {
                    $and: [
                        {
                            from: { $lte: to }
                        },
                        {
                            from: { $gte: from }
                        }
                    ]
                },
                {
                    $and: [
                        {
                            to: { $gte: from }
                        },
                        {
                            to: { $lte: to }
                        }
                    ]
                },
                {
                    $and: [
                        {
                            to: { $gte: from }
                        },
                        {
                            from: { $lte: to }
                        }
                    ]
                },
                {
                    $and: [
                        {
                            to: { $lte: from }
                        },
                        {
                            from: { $gte: to }
                        }
                    ]
                }
            ]
        }
    ).select('vehicle -_id')
}


//display reservation
module.exports.displayReservation = (req, res, next) => {
    Reservation.find((err, reservation) => {
        if (err) {
            consolele.log('error');
        }
        else {
            res.json(reservation)
        }
    }).sort('from').populate('vehicle').populate('user');
}

//edit vehicle
module.exports.editReservation = (req, res, next) => {
    let id = req.params.id;
    Reservation.findById(id, (err, reservation) => {
        res.json(reservation);
        console.log('reservation edit works');
    });
}

module.exports.getByUser = (req, res, next) => {
    console.log(req.params.id)
    Reservation.find(
        {
            from: { $gte: Date.now() },
            user: req.params.id
        },
        (err, data) => {
            if (err) res.json(err)
            else res.json(data)
        }
    ).populate('vehicle').sort('from')
}

module.exports.getOldByUser = (req, res, next) => {
    console.log(req.params.id)
    Reservation.find(
        {
            from: { $lt: Date.now() },
            user: req.params.id
        },
        (err, data) => {
            if (err) res.json(err)
            else res.json(data)
        }
    ).populate('vehicle').sort('from')
}



module.exports.updateReservation = (req, res, next) => {
    Reservation.findByIdAndUpdate(req.params.id, {
        $set: {
            reservingDate: req.body.reservingDate,
            returningDate: req.body.returningDate,
            destination: req.body.destination,
            daysExpected: req.body.daysExpected,
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

//delete reservation
module.exports.deleteReservation = (req, res, next) => {
    Reservation.findByIdAndRemove({ _id: req.params.id }, function (err, reservation) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
}
