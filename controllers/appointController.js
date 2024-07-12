const Appointment = require('../model/appointModel');

// Helper function to calculate end time
const calculateEndTime = (startTime, duration) => {
  return new Date(new Date(startTime).getTime() + duration * 60000);
};

exports.bookAppointment = async (req, res) => {
  try {
    const { userId, counselorId, date, startTime, duration, price, sessionType } = req.body;

    // Validate incoming data
    if (!userId || !counselorId || !date || !startTime || !duration || !price || !sessionType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Log incoming data for debugging
    console.log('Incoming booking data:', req.body);

    // Calculate end time based on start time and duration
    const startTimeDate = new Date(`${date}T${startTime}`);
    const endTimeDate = calculateEndTime(startTimeDate, duration);

    // Check if the time slot is available
    const existingAppointments = await Appointment.find({
      counselor: counselorId,
      date: date,
      $or: [
        { startTime: { $lt: endTimeDate, $gte: startTimeDate } },
        { endTime: { $gt: startTimeDate, $lte: endTimeDate } }
      ]
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: 'The selected time slot is not available.' });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      user: userId,
      counselor: counselorId,
      date,
      startTime: startTimeDate,
      endTime: endTimeDate,
      duration,
      price,
      paymentStatus: false, // Assuming payment status is updated later
      sessionType,
      status: 'Scheduled'
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Booking successful', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error); // Add this line to log the error
    res.status(500).json({ message: 'Server error', error: error.message }); // Include error message
  }
};

//for admin

exports.getBookedSessionsAdmin = async (req, res) => {
    try {
      const { counselorId, date } = req.query;
  
      let query = {};
  
      // If counselorId is provided, add it to the query
      if (counselorId) {
        query.counselor = counselorId;
      }
  
      // If date is provided, add a date range to the query
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
  
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
  
        query.startTime = { $gte: startOfDay, $lte: endOfDay };
      }
  
      // Find appointments based on the query
      const appointments = await Appointment.find(query);
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


exports.getBookedSessions = async (req, res) => {
  try {
    const { counselorId, date, userId } = req.query;

    let query = {};

    // If counselorId is provided, add it to the query
    if (counselorId) {
      query.counselor = counselorId;
    }

    // If userId is provided, add it to the query
    if (userId) {
      query.user = userId;
    }

    // If date is provided, add a date range to the query
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    // Find appointments based on the query
    const appointments = await Appointment.find(query);

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Fetch appointments for a specific counselor
exports.getCounselorAppointments = async (req, res) => {
  try {
    const counselorId = req.query.counselorId;

    if (!counselorId) {
      return res.status(400).json({ message: 'Counselor ID is required.' });
    }

    const appointments = await Appointment.find({ counselor: counselorId }).populate('user', 'userName email');

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching counselor appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
console.log("I AM HERE IN CANCEL")
    console.log(appointmentId)
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Calculate the difference between the current time and the appointment start time
    const currentTime = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = appointmentTime - currentTime;

    // Check if the appointment is within 24 hours
    if (timeDifference < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      return res.status(400).json({ message: "Cannot cancel appointment within 24 hours of the start time" });
    }

    // Cancel the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateMeetingCode = async (req, res) => {
  try {
    const { appointmentId, meetingCode } = req.body;

    if (!appointmentId || !meetingCode) {
      return res.status(400).json({ message: 'Appointment ID and meeting code are required.' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    appointment.meetingCode = meetingCode;
    await appointment.save();

    res.status(200).json({ message: 'Meeting code updated successfully.', appointment });
  } catch (error) {
    console.error('Error updating meeting code:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required.' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.fetchTimeSlots = async (req, res) => {
  try {
    const {  counselorId, date, startTime, duration } = req.body;

    // Validate incoming data
    if ( !counselorId || !date || !startTime || !duration) {
      return res.status(400).json({ message: 'All fields are required.' });
    }



    // Calculate end time based on start time and duration
    const startTimeDate = new Date(`${date}T${startTime}`);
    const endTimeDate = calculateEndTime(startTimeDate, duration);

    // Check if the time slot is available
    const existingAppointments = await Appointment.find({
      counselor: counselorId,
      date: date,
      $or: [
        { startTime: { $lt: endTimeDate, $gte: startTimeDate } },
        { endTime: { $gt: startTimeDate, $lte: endTimeDate } }
      ]
    });
    const bookedSlots = existingAppointments.map((app)=>{app.startTime, app.endTime})
    console.log('existing', bookedSlots)

    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error('Error booking appointment:', error); // Add this line to log the error
    res.status(500).json({ message: 'Server error', error: error.message }); // Include error message
  }
};
