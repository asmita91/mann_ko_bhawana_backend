

//import
const router=require('express').Router();
const express = require("express");

const articleController=require('../controllers/counselorController.js');

const {authGuard,authGuardAdmin } = require('../middleware/authGuard.js');



router.post('/create_counselor',  articleController.createCounselor)
router.post('/login_counselor',  articleController.loginCounselor)

router.get("/get_counselors",articleController.getAllCounselors)

router.get("/get_counselor/:id", articleController.getSingleCounselor)

router.put("/update_counselor/:id", articleController.updateCounselor)

router.delete("/delete_counselor/:id", articleController.deleteCounselor)


//pagination routes
router.get('/get_pagination',articleController.getPagination)

// Review routes
router.post("/review", articleController.createReview);
router.get("/reviews/:id", articleController.getReviews);
router.put("/review/:reviewId", authGuard, articleController.updateReview);
router.delete("/review/:reviewId", authGuard, articleController.deleteReview);




//export
module.exports=router;
