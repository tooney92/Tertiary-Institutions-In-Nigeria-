const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const webtoken = require("../middleware/auth")
const {loadUniversityData, loadCollegeData, loadPolytechnicsData} = require("../controller/loadData")

//loadData
router.post("/",  loadUniversityData)
router.post("/collegeData",  loadCollegeData)
router.post("/polytechnicsData",  loadPolytechnicsData)


module.exports = router;