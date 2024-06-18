
const mongoose=require("mongoose");


const appointmentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'counselors',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date, 
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: Boolean,
      default: false,
      required: true
    },
    sessionType: {
      type: String,
      required: true,
      enum: ['Individual', 'Teenager', 'Couple'] 
    },
    status: {
      type: String,
      default: 'Scheduled',
      required: true,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'] 
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    meetingCode: {
      type: String,
      required: false // This can be set to true if every appointment should have a meeting code
    }
  });
  
  const Appointment = mongoose.model("Appointment", appointmentSchema);
  module.exports = Appointment;
