const mongoose = require('mongoose');

const Vehicle = mongoose.model('Vehicle');

const multer = require('multer');
const reservationController = require('../controllers/reservation.controller');
const upload = multer({ dest: 'uploads/' });

//add vehicle
module.exports.addVehicle = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')

    console.log(req.file)
    var vehicle = new Vehicle();
    vehicle.registrationNumber = req.body.registrationNumber;
    vehicle.brand = req.body.brand;
    vehicle.model = req.body.model;
    vehicle.numberOfSeats = req.body.numberOfSeats;
    vehicle.fuelType = req.body.fuelType;
    vehicle.distance = req.body.distance;
    vehicle.price = req.body.price;
    vehicle.img = url + '/public/' + req.file.filename
    // vehicle.image = req.body.image;
    // vehicle.frontImage = req.body.frontImage;
    vehicle.save((err, doc) => {
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

//display vehicle{}
module.exports.displayVehicle = (req, res, next) => {
    Vehicle.find((err, vehicle) => {
        if (err) {
            consolele.log('error');
        }
        else {
            res.json(vehicle)
        }
    });
}

//edit vehicle
module.exports.editVehicle = (req, res, next) => {
    let id = req.params.id;
    Vehicle.findById(id, (err, vehicle) => {
        res.json(vehicle);
    });
}

module.exports.getAll = async (req, res, next) => {
    //let page = req.query.page;
    //let limit = req.query.limit;

    let f = await reservationController.getReservationsByDate(req.body.from, req.body.to);
    let vehicles = []
    f.forEach(v => {
        vehicles.push(v.vehicle)
    })

    query = {
        _id: { $nin: vehicles },
        $and : [
            {
                $or : [
                    {
                        brand: { "$regex": req.body.key, "$options": "i" }
                    },
                    {
                        model: { "$regex": req.body.key, "$options": "i" }
                    }
                ]
            }
        ]
    }

    if(req.body.seats != -1){
        query.$and.push({
            numberOfSeats: req.body.seats
        });
    }
    console.log(vehicles)
    Vehicle.find(query, (err, val) => { 
        res.json(val);
    }).sort({brand: 1})
}


module.exports.getVehicleById = async (req, res, next) => {
    Vehicle.findById(req.params.id, (err, data) => {
        if (err) res.json(err)
        else res.json(data);
    }).select('registrationNumber brand model numberOfSeats fuelType price -_id')
}

module.exports.reserve = (req, res) => {
    Vehicle.findByIdAndUpdate(req.params.id, {
        $set: {
            reservation: req.body
        }
    },
        (err, data) => {
            res.json(err ? err : data).status(err ? 500 : 200);
        });
}

module.exports.updateVehicle = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    Vehicle.findByIdAndUpdate(req.params.id, {
        $set: {
            registrationNumber: req.body.registrationNumber,
            brand: req.body.brand,
            model: req.body.model,
            numberOfSeats: req.body.numberOfSeats,
            fuelType: req.body.fuelType,
            distance: req.body.distance,
            price: req.body.price,
            img: url + '/public/' + req.file.filename
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

module.exports.deleteVehicle = (req, res, next) => {
    Vehicle.findByIdAndRemove({ _id: req.params.id }, function (err, vehicle) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
}


// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'uploads')
//     },
//     filename: (req, file, callback) => {
//         callback(null, `carRental_${file.originalname}`)
//     }
// })

// var upload = multer({ storage : storage})

// module.exports.file = (req,res,next) => {
//     const file = req.file;
//     console.log(file.filename);
//     if(!file){
//         const error =  new Error('please upload a file');
//         return next(error);
//     }
//     res.send(file);
// }