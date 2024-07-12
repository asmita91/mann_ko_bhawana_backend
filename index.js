const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./database/db");
const cors = require("cors");
const cloudinary = require("cloudinary").v2; // Ensure using v2 for cloudinary
const acceptMultiparty = require("connect-multiparty");

const app = express();

// dotenv config
dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use multiparty for handling file uploads
app.use(acceptMultiparty());

// CORS config to accept request from frontend
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
connectDB();

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Hello from server");
});

// User routes
app.use("/api/user", require("./routes/userRoutes"));
// app.use("/api/article", require("./routes/articleRoutes")); 
// app.use("/api/product", require("./routes/productRoutes")); 
app.use("/api/counselor", require("./routes/counselorRoute")); 
app.use('/api/questionnaire', require("./routes/questionnaireRoute"));
app.use('/api/issue', require("./routes/issueRoute"));
app.use('/api/appointments', require("./routes/appointmentRoutes"));



// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define port and start server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not defined
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Exporting app for testing or further use
module.exports = app;
