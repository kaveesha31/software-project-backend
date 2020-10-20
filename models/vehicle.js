const mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: 'Registration Number cannot be empty',
        unique: true
    },
    brand: {
        type: String,
        required: 'Brand cannot be empty'
    },
    model: {
        type: String,
        required: 'Model cannot be empty'
    },
    numberOfSeats: {
        type: String,
        required: 'Number Of Seats cannot be empty'
    },
    fuelType: {
        type: String,
        required: 'Fuel Type cannot be empty'
    },
    distance: {
        type: String,
        required: 'distance cannot be empty'
    },
    price: {
        type: Number,
        required: 'distance cannot be empty'
    },
    img: {
        type: String
    },
    reservation: {
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        from: {
            type: Date
        },
        to: {
            type: Date
        },
        destination: {
            type: String
        },
        completed: {
            type: Boolean,
            default: true
        }
    },
    rating : {
        type: Number,
        default: 0
    },
    total_rates : {
        type: Number,
        default: 0
    }
    // image : {data : Buffer, contentType : String}
}, {
    collection: 'vehicle'
});

mongoose.model('Vehicle', vehicleSchema);