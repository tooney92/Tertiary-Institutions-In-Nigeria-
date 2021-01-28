const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const webtoken = require("../middleware/auth")
const {allPoly, addPoly, removePoly, updatePoly} = require("../controller/poly")


router.get("/",  allPoly)

router.post("/",  addPoly)

router.delete("/:id",  removePoly)

router.put("/:id",  updatePoly)


module.exports = router;