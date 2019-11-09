const mongoose = require('mongoose');

const Reservation = mongoose.model('Reservation');

//add reservation
module.exports.addReservation = (req,res,next) => {
    var reservation = new Reservation();
    reservation.reservingDate = req.body.reservingDate;
    reservation.returningDate = req.body.returningDate;
    reservation.destination = req.body.destination;
    reservation.daysExpected = req.body.daysExpected;
    reservation.save((err,doc)=> {
        if(!err){
            res.send(doc);
        } else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate Reserving Date found.']);
            else
                // return next(err);
                res.send('all the fields should be filled');
        }
    });
}


//display reservation
module.exports.displayReservation = (req,res,next) => {
    Reservation.find((err,reservation) => {
        if(err){
            consolele.log('error');
        }
        else{
            res.json(reservation)
        }
    });
}

//edit vehicle
module.exports.editReservation = (req,res,next) => {
    let id = req.params.id;
    Reservation.findById(id,  (err, reservation) => {
        res.json(reservation);
        console.log('reservation edit works');
    });
} 

module.exports.updateReservation = (req,res,next) => {
    Reservation.findByIdAndUpdate(req.params.id,{
        $set : {
            reservingDate : req.body.reservingDate,
            returningDate : req.body.returningDate,
            destination : req.body.destination,
            daysExpected : req.body.daysExpected,
        }
    },
    {
        new : true
    },
    function(err, doc){
        if(err){
            res.send('error on updating');
        }else{
            res.json(doc);
        }
    }
    );
}

//delete reservation
module.exports.deleteReservation = (req,res,next) => {
    Reservation.findByIdAndRemove({_id: req.params.id}, function(err, reservation){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
}
