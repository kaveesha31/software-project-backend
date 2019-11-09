const mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
    reservingDate : {
        type : String,
        required : 'Reserving Date Number cannot be empty',
        unique : true
    },
    returningDate : {
        type : String,
        required : 'Returning Date cannot be empty'
    },
    destination : {
        type : String,
        required : 'estination cannot be empty'
    },
    daysExpected : {
        type : Number,
        required : 'Days Expected Of Seats cannot be empty'
    }
},{
    collection: 'reservation'
});

mongoose.model('Reservation', reservationSchema);