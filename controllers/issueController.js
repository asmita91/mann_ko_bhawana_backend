


const cloudinary = require("cloudinary");
const Issues = require("../model/issueModel");

const createIssue = async (req,res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        issueName, 
        issueDescription,
        whatIsIt,
        stat,
        youtubeUrl,
        issueQuestion

        
    } = req.body;
    const {issueImage} = req.files;

    // step 3 : Validate data
    if(!issueName    ||  !issueDescription ||!issueQuestion  || !whatIsIt || !stat ||! youtubeUrl  ||!issueImage){
        return res.json({
            success : false,
            message : "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            issueImage.path,
            {
                folder : "issues",
                crop : "scale"
            }
        )

        // Save to database
        const newIssue = new Issues({
            issueName : issueName,
            issueDescription : issueDescription,
            issueImageUrl : uploadedImage.secure_url,
            whatIsIt:whatIsIt,
            issueQuestion:issueQuestion,
            youtubeUrl:youtubeUrl,
            stat:stat
        })
        await newIssue.save();
        res.json({
            success : true,
            message : "Issue's details added successfully",
            issue : newIssue
        })


        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }

}

const getAllIssues = async (req, res) => {
    try {
      const issues = await Issues.find();
      res.json({ issues });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const getSingleIssue = async (req,res) => {
    const issueId = req.params.id;
    try {
        const singleIssue = await Issues.findById(issueId);
        res.json({
            success : true,
            message : "Single issue fetched successfully!",
            issue : singleIssue
        })
        
    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }
}

const updateIssue = async (req,res) => {
    // step 1 : check incoming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const {
        issueName,
        issueDescription,
        youtubeUrl,
        stat,
        whatIsIt, issueQuestion
      

        
    } = req.body;
    const {issueImage} = req.files;

    // validate data
    if(!issueName    ||  !issueDescription ||! issueQuestion  || !whatIsIt || !stat ||! youtubeUrl 
        ){
        return res.json({
            success : false,
            message : "Required fields are missing!"
        })
    }

    try {
        // case 1 : if there is image
        if(issueImage){
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                issueImage.path,
                {
                    folder : "issues",
                    crop : "scale"
                }
            )

            // make updated json data
            const updatedData = {
                issueName : issueName,
            issueDescription : issueDescription,
            issueImageUrl : uploadedImage.secure_url,
            whatIsIt:whatIsIt,
            youtubeUrl:youtubeUrl,
            issueQuestion: issueQuestion,
            stat:stat
            }

            // find product and update
            const issueId = req.params.id;
            await Issues.findByIdAndUpdate(issueId, updatedData)
            res.json({
                success : true,
                message : "Issues's detail updated successfully with Image!",
                updatedIssue : updatedData
            })

        } else {
            // update without image
            const updatedData = {
                issueName : issueName,
                issueDescription : issueDescription,
                whatIsIt:whatIsIt,
                issueQuestion:issueQuestion,
                youtubeUrl:youtubeUrl,
                stat:stat
            }

            // find product and update
            const issueId = req.params.id;
            await Issues.findByIdAndUpdate(issueId, updatedData)
            res.json({
                success : true,
                message : "Issue's detail updated successfully without Image!",
                updatedIssue : updatedData
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
const deleteIssue = async (req,res) =>{
    const issueId = req.params.id;

    try {
        await Issues.findByIdAndDelete(issueId);
        res.json({
            success : true,
            message : "Issue info deleted successfully!"
        })
        
    } catch (error) {
        res.json({
            success : false,
            message : "Server error!!"
        })
    }
}

const getPaginationIssue = async (req, res) => {
    const requestedPage = parseInt(req.query.page, 10) || 1;
    const resultPerPage = 3;

    try {
        const totalIssues = await Issues.countDocuments();
        const issues = await Issues.find({})
            .skip((requestedPage - 1) * resultPerPage)
            .limit(resultPerPage);

        if (issues.length === 0) {
            return res.json({
                success: false,
                message: "No issues found!"
            });
        }

        res.json({
            success: true,
            issues: issues,
            currentPage: requestedPage,
            totalPages: Math.ceil(totalIssues / resultPerPage),
            totalIssues: totalIssues
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred in pagination");
    }
};


module.exports = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
    getPaginationIssue
}