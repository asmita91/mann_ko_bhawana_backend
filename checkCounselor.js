const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://asmitakatel444:mann@cluster0.2pcot5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });

const Counselors = require("./model/counselorModel");

const checkCounselor = async (counselorCode) => {
  const counselor = await Counselors.findOne({ counselorCode });
  console.log(counselor);
};

checkCounselor(1000); // Replace with the actual counselor code
