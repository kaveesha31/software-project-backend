const express = require('express');
const router = express.Router();
const multer = require('multer');

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/upload', upload.single('test'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    res.send({ url: url + '/public/' + req.file.filename });
})




const Vehicle = require('../models/vehicle');

const ctrlUser = require('../controllers/user.controller');
const ctrlfeedback = require('../controllers/feedback.controller');
const ctrlVehicle = require('../controllers/vehicle.controller');
const ctrlReservation = require('../controllers/reservation.controller');
const ctrlMail = require('../misc/mailer');
const passport = require('passport');

const jwtHelper = require('../helpers/jwthelper');


//user routes
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/user/:id', ctrlUser.getUserById);
router.post('/verifyAccount', ctrlUser.verifyAccount);
router.get('/displayUsers', ctrlUser.displayUsers);
router.route('/deleteUser/:id').get(ctrlUser.deleteUser);
router.route('/editUserProfile/:id').get(ctrlUser.editUserProfile);
router.post('/getEmail', ctrlUser.getEmail);
router.post('/resetPassword',ctrlUser.resetPassword);
router.post('/updateProfileImage/:id', upload.single('image'), ctrlUser.updateImage)

router.route('/updateUserProfile/:id').put(ctrlUser.updateUserProfile);
router.route('/oauth/facebook').post(passport.authenticate('facebookToken', { session: false }), ctrlUser.facebookLogin);
//router.post('/sendEmail', ctrlMail.sendMail);

//vehicle routes
router.get('/vehicle/:id', ctrlVehicle.getVehicleById);
router.post('/addVehicle', upload.single('productImage'), ctrlVehicle.addVehicle);
router.get('/displayVehicle', ctrlVehicle.displayVehicle);
router.post('/vehicle/all', ctrlVehicle.getAll)
router.route('/editVehicle/:id').get(ctrlVehicle.editVehicle);
router.post('/updateVehicle/:id', upload.single('productImage'), ctrlVehicle.updateVehicle);
router.route('/deleteVehicle/:id').get(ctrlVehicle.deleteVehicle);
// router.route('/file', upload.single('file')).post(ctrlVehicle.file);


//reservation routes
router.post('/vehicle/reserve', ctrlReservation.addReservation);
router.get('/reservation/user/:id', ctrlReservation.getByUser);
router.get('/reservation/old/user/:id', ctrlReservation.getOldByUser);
router.post('/reservation/rate', ctrlReservation.addRating);
router.post('/addReservation', ctrlReservation.addReservation);
router.get('/displayReservation', ctrlReservation.displayReservation);
router.route('/editReservation/:id').get(ctrlReservation.editReservation);
router.route('/updateReservation/:id').put(ctrlReservation.updateReservation);
router.route('/deleteReservation/:id').get(ctrlReservation.deleteReservation);
router.get('/markAsCompleted/:id', ctrlReservation.markAsCompleted);
// router.get('/getVehicle', ctrlVehicle.getVehicle);


//feedback routes
router.post('/feedback', ctrlfeedback.feedback);
router.get('/displayFeedback', ctrlfeedback.displayFeedback);
router.route('/deleteFeedback/:id').get(ctrlfeedback.deleteFeedback);
router.get('/feedback/:id', ctrlfeedback.getFeedbackById);


module.exports = router;
