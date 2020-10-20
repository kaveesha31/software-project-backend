const mongoose = require('mongoose');

const Reservation = mongoose.model('Reservation');
const Vehicle = mongoose.model('Vehicle');

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

module.exports.addRating = (req, res) => {
    var reservation = new Reservation(req.body);
    console.log(reservation.vehicle);
    Reservation.findById(reservation._id, (err, reser) => {
        console.log(reser)
        if (reser) {
            Vehicle.findById(reservation.vehicle, (err, doc) => {
                if (err) console.log(err);
                var new_rate = ((doc.rating * doc.total_rates) - reser.rating + reservation.rating) 
                if (reser.rating === 0)
                    doc.total_rates = doc.total_rates + 1;
                new_rate /= doc.total_rates
                console.log('reteeeeeeeeeeeeeeeeeeeeee')
                console.log(new_rate)
                doc.rating = Number(new_rate);

                doc.save((err, dc) => {
                    if (dc) {
                        res.json(dc);
                    } else {
                        console.log(err)
                        res.json(err)
                    }
                })
                Reservation.findByIdAndUpdate(reservation._id, reservation, (err, dooo) => { });
            });
            //res.json(doc);
        } else {
            res.json(err);
        }
    });
}

module.exports.markAsCompleted = (req, res) => {
    Reservation.findByIdAndUpdate(req.params.id, {
        $set: {
            completed: true
        }
    }, (err, data) => {
        if (err) res.json(err)
        else res.json(data)
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
