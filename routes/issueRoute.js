

//import
const router=require('express').Router();
const express = require("express");

const issueController=require('../controllers/issueController.js');

const {authGuard,authGuardAdmin } = require('../middleware/authGuard.js');


router.post('/create_issue',  issueController.createIssue)

router.get("/get_issues",issueController.getAllIssues)

router.get("/get_issue/:id", issueController.getSingleIssue)

router.put("/update_issue/:id", issueController.updateIssue)

router.delete("/delete_issue/:id", issueController.deleteIssue)


//pagination routes
router.get('/get_pagination_issue',issueController.getPaginationIssue)
//export
module.exports=router;
