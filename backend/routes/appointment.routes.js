const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctorAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    getAllAppointments,
} = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// patient routes
router.post('/book', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.put('/:id/cancel', protect, authorize('patient'), cancelAppointment);

// doctor routes
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/approve', protect, authorize('doctor'), approveAppointment);
router.put('/:id/reject', protect, authorize('doctor'), rejectAppointment);
router.put('/:id/complete', protect, authorize('doctor'), completeAppointment);

// admin routes
router.get('/all', protect, authorize('admin'), getAllAppointments);

module.exports = router;