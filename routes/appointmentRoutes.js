const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointController');

router.post('/book', appointmentController.bookAppointment);
router.get('/booked', appointmentController.getBookedSessions);
router.get('/booked_admin', appointmentController.getBookedSessionsAdmin);
router.post('/fetch-time-slots', appointmentController.fetchTimeSlots);

router.get('/counselor/appointments', appointmentController.getCounselorAppointments);
router.put('/update-meeting-code', appointmentController.updateMeetingCode);
router.get('/:appointmentId', appointmentController.getAppointmentById); // New route

router.delete('/cancel/:appointmentId', appointmentController.cancelAppointment); 

module.exports = router;
