const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const webtoken = require("../middleware/auth")
const {addUni, removeUni, UpdateUni, allUnis} = require("../controller/universities")


router.get("/",  allUnis)

router.post("/",  addUni)

router.delete("/:id",  removeUni)

router.put("/:id",  UpdateUni)


module.exports = router;