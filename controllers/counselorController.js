
const cloudinary = require("cloudinary");
const Counselors = require("../model/counselorModel");
const Reviews = require("../model/reviewModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginCounselor = async (req, res) => {
  const { counselorCode, password } = req.body;
  console.log("OK");


  // Log received data
  console.log("Received counselorCode:", counselorCode);
  console.log("Received password:", password);

  // Check if both fields are provided
  if (!counselorCode || !password) {
    return res.status(400).json({ success: false, message: "Please enter all fields" });
  }

  try {
    // Ensure counselorCode is handled as a number
    const counselor = await Counselors.findOne({ counselorCode: parseInt(counselorCode, 10) });

    // Log the result of the database query
    console.log("Counselor found:", counselor);
    console.log("OK", counselor);


    if (!counselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }

    const isMatch = await bcrypt.compare(password, counselor.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect login credentials. Please try again." });
    }

    const token = counselor.getSignedJwtToken();

    res.status(200).json({ success: true, message: "Login successful", token, userData: counselor });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const createCounselor = async (req,res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        counselorName, 
        counselorPosition,
        counselorDescription,
        expertise,
        educationalDegree,
        approach,
        philosophy,
        counselorCode

        
    } = req.body;
    const {counselorImage} = req.files;

    // step 3 : Validate data
    if(!counselorName  || !counselorPosition  ||  !counselorDescription  || !expertise || !approach ||! educationalDegree ||!philosophy ||!counselorImage || ! counselorCode){
        return res.json({
            success : false,
            message : "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            counselorImage.path,
            {
                folder : "counselors",
                crop : "scale"
            }
        )

        // Save to database
        const newCounselor = new Counselors({
            counselorName : counselorName,
            counselorDescription : counselorDescription,
            counselorImageUrl : uploadedImage.secure_url,
            counselorPosition:counselorPosition,
            expertise:expertise,
            philosophy:philosophy,
            approach:approach,
            educationalDegree:educationalDegree,
            counselorCode: counselorCode
        })
        await newCounselor.save();
        res.json({
            success : true,
            message : "Counselor's details added successfully",
            counselor : newCounselor
        })


        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }

}



const getAllCounselors = async (req, res) => {
    try {
      const counselors = await Counselors.find();
      res.json({ counselors });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const getSingleCounselor = async (req,res) => {
    const counselorId = req.params.id;
    try {
        const singleCounselor = await Counselors.findById(counselorId);
        res.json({
            success : true,
            message : "Single counselor fetched successfully!",
            counselor : singleCounselor
        })
        
    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }
}

const updateCounselor = async (req,res) => {
    // step 1 : check incoming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const {
        counselorName,
        counselorDescription,
        counselorPosition,
        expertise,
        approach,
        philosophy,
        educationalDegree,
        counselorCode

        
    } = req.body;
    const {counselorImage} = req.files;

    // validate data
    if( !counselorName  || !counselorPosition  ||  !counselorDescription  || !expertise || !approach ||! educationalDegree ||!philosophy  || !counselorCode
        ){
        return res.json({
            success : false,
            message : "Required fields are missing!"
        })
    }

    try {
        // case 1 : if there is image
        if(counselorImage){
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                counselorImage.path,
                {
                    folder : "counselors",
                    crop : "scale"
                }
            )

            // make updated json data
            const updatedData = {
                counselorName : counselorName,
            counselorDescription : counselorDescription,
            counselorImageUrl : uploadedImage.secure_url,
            counselorPosition:counselorPosition,
            expertise:expertise,
            philosophy:philosophy,
            approach:approach,
            educationalDegree:educationalDegree,
            counselorCode: counselorCode
            }

            // find product and update
            const counselorId = req.params.id;
            await Counselors.findByIdAndUpdate(counselorId, updatedData)
            res.json({
                success : true,
                message : "Counselor's detail updated successfully with Image!",
                updatedCounselor : updatedData
            })

        } else {
            // update without image
            const updatedData = {
                counselorName : counselorName,
                counselorDescription : counselorDescription,
                counselorPosition:counselorPosition,
                expertise:expertise,
                philosophy:philosophy,
                approach:approach,
                educationalDegree:educationalDegree,
                counselorCode: counselorCode
            }

            // find product and update
            const counselorId = req.params.id;
            await Counselors.findByIdAndUpdate(counselorId, updatedData)
            res.json({
                success : true,
                message : "Counselor's detail updated successfully without Image!",
                updatedCounselor : updatedData
            })
        }
        
    } catch (error) {
        res.status(500).json({  
            success : false,
            message : "Internal server error"
        })
    }
}

// delete product
const deleteCounselor = async (req,res) =>{
    const counselorId = req.params.id;

    try {
        await Counselors.findByIdAndDelete(counselorId);
        res.json({
            success : true,
            message : "Counselor's info deleted successfully!"
        })
        
    } catch (error) {
        res.json({
            success : false,
            message : "Server error!!"
        })
    }
}

const getPagination = async (req, res) => {
    const requestedPage = parseInt(req.query.page, 10) || 1;
    const resultPerPage = 3;

    try {
        const totalCounselors = await Counselors.countDocuments();
        const counselors = await Counselors.find({})
            .skip((requestedPage - 1) * resultPerPage)
            .limit(resultPerPage);

        if (counselors.length === 0) {
            return res.json({
                success: false,
                message: "No counselors found!"
            });
        }

        res.json({
            success: true,
            counselors: counselors,
            currentPage: requestedPage,
            totalPages: Math.ceil(totalCounselors / resultPerPage),
            totalCounselors: totalCounselors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred in pagination");
    }
};

const createReview = async (req, res) => {

    const { rating, comment, counselorId, userId } = req.body;
    console.log("this is userId");

  
    if (!rating || !comment || !counselorId|| !userId) {
      return res.status(400).json({
        success: false,
        message: "Rating, comment, and counselor ID are required",
      });
    }
  
    try {
      const counselor = await Counselors.findById(counselorId);
      if (!counselor) {
        return res.status(404).json({
          success: false,
          message: "Counselor not found",
        });
      }
  
      const newReview = new Reviews({
        user: userId,
        counselor: counselorId,
        rating,
        comment,
      });
  
      await newReview.save();
      
      // Populate the user information in the review
      const savedReview = await Reviews.findById(newReview._id).populate(
        "user",
        "userName"
      );
  
      res.status(201).json({
        success: true,
        message: "Review added successfully!",
        review: savedReview,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
  


const getReviews = async (req, res) => {
    const counselorId = req.params.id;
  
    try {
      const reviews = await Reviews.find({ counselor: counselorId }).populate(
        "user",
        "userName"
      );
  
      // Log the reviews to verify the populated data
      console.log(reviews);
  
      res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
  const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming you have middleware to attach user info to req
  
    try {
      const review = await Reviews.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
  
      if (review.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized action" });
      }
  
      review.rating = rating || review.rating;
      review.comment = comment || review.comment;
      await review.save();
  
      res.json({ success: true, message: "Review updated successfully", review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id; // Assuming you have middleware to attach user info to req
  
    try {
      const review = await Reviews.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }
  
      if (review.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized action" });
      }
  
      await Reviews.findByIdAndDelete(reviewId); // Use findByIdAndDelete to remove the review
      res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  


module.exports = {
    createCounselor,
    getAllCounselors,
    getSingleCounselor,
    updateCounselor,
    deleteCounselor,
    getPagination,
    createReview, 
    getReviews,
    loginCounselor,
updateReview, deleteReview
}

