const mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
    from: {
        type: Date
    },
    to: {
        type: Date
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    odoStart: {
        type: Number
    },
    odoEnd: {
        type: Number
    },
    completed: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Reservation', reservationSchema);