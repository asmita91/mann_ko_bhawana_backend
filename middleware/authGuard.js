// const userModel = require("../model/userModel");
// const jwt=require('jsonwebtoken');
 
// const authGuard=(req,res,next)=>{
//     //check if auth header is present
//     const authHeader=req.headers.authorization;
//     if(!authHeader){
//         return res.json({
//             success:false,
//             message: "Authorization header missing!"
//         })
//     }
    
 
//     //split auth header and get token
//     //format :"Bearer djhhsjdfvhfsahgcjjdshvreduwrrwye5q67eqweywt"
//     const token =authHeader.split(' ')[1];
//     if(!token){
//        return res.json({
//             success: false,
//             message: "Token missing!"
//         })
//     }
//     //verify token
//     try {
//         const decodedData=jwt.verify(token,process.env.JWT_SECRET);
//         req.user=decodedData;
//         next();
//     } catch (error) {
//         res.json({
//             success:false,
//             message:"Invalid token!"
//         })
//     }
 
 
 
 
// };
 
 
// const authGuardAdmin=(req,res,next)=>{
//     //check if auth header is present
//     const authHeader=req.headers.authorization;
//     if(!authHeader){
//         return res.json({
//             success:false,
//             message: "Authorization header missing!"
//         })
//     }
 
//     //split auth header and get token
//     //format :"Bearer djhhsjdfvhfsahgcjjdshvreduwrrwye5q67eqweywt"
//     const token =authHeader.split(' ')[1];
//     if(!token){
//        return res.json({
//             success: false,
//             message: "Token missing!"
//         })
//     }
//     //verify token
//     try {
//         const decodedData=jwt.verify(token,process.env.JWT_SECRET);
//         req.user=decodedData;
//         if(!req.user.isAdmin){
//            return res.json({success:false,
//                 message: "Permission denied",
//             })
//         }
//         next();
//     } catch (error) {
//         res.json({
//             success:false,
//             message:"Invalid token!"
//         })
//     }
// };
//  const requireSignIn = async (req, res, next) => {
//     try {
//       const decode = JWT.verify(
//         req.headers.authorization,
//         process.env.JWT_SECRET
//       );
//       req.user = decode;
//       next();
//     } catch (error) {
//       console.log(error);
//     }
//   };
// //  const isAdmin = async (req, res, next) => {
// //     const { email } = req.body;
// //     try {
// //       const user = await userModel.findOne({ email: email });
// //       if (user.role !== true) {
// //         return res.status(401).send({
// //           success: false,
// //           message: "UnAuthorized Access",
// //         });
// //       } else {
// //         next();
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       res.status(401).send({
// //         success: false,
// //         error,
// //         message: "Error in admin middelware",
// //       });
// //     }
// //   };
// module.exports={
//     authGuard,
//     authGuardAdmin, requireSignIn
// };
 


const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    // Check if auth header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header missing!"
        });
    }

    // Split auth header and get token
    // Format: "Bearer djhhsjdfvhfsahgcjjdshvreduwrrwye5q67eqweywt"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token missing!"
        });
    }

    // Verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;
        next();
    } catch (error) {
        res.json({
            success: false,
            message: "Invalid token!"
        });
    }
};

const authGuardAdmin = (req, res, next) => {
    // Check if auth header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header missing!"
        });
    }

    // Split auth header and get token
    // Format: "Bearer djhhsjdfvhfsahgcjjdshvreduwrrwye5q67eqweywt"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token missing!"
        });
    }

    // Verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;
        if (!req.user.isAdmin) {
            return res.json({
                success: false,
                message: "Permission denied",
            });
        }
        next();
    } catch (error) {
        res.json({
            success: false,
            message: "Invalid token!"
        });
    }
};

 const requireSignIn = async (req, res, next) => {
    try {
      const decode = JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
    }
  };
//  const isAdmin = async (req, res, next) => {
//     const { email } = req.body;
//     try {
//       const user = await userModel.findOne({ email: email });
//       if (user.role !== true) {
//         return res.status(401).send({
//           success: false,
//           message: "UnAuthorized Access",
//         });
//       } else {
//         next();
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(401).send({
//         success: false,
//         error,
//         message: "Error in admin middelware",
//       });
//     }
//   };

module.exports = {
    authGuard,
    authGuardAdmin,
    requireSignIn
};
