const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const webtoken = require("../middleware/auth")
const {allColleges, addCollege, removeCollege, updateCollege} = require("../controller/college")


router.get("/",  allColleges)

router.post("/",  addCollege)

router.delete("/:id",  removeCollege)

router.put("/:id",  updateCollege)


module.exports = router;