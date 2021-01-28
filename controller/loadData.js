const express = require("express")
const router = express.Router()
const { Validator } = require('node-input-validator')
const webtoken = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const University = require("../model/university")
const College = require("../model/college")
const Polytechnic = require("../model/polytechnic")
const {uni, collegesData, polytechnicsData} = require("../data/data.js")

const VerrorsMessageFormatter = (Verrors) => {       //formats verror message
    let errors = Object.entries(Verrors)
    errorsFormatted = errors.map(h => h[1].message)
    return errorsFormatted
}

const duplicateMessageFormatter = (message) => {
    const messagePolish = Object.entries(message)[0][0]
    console.log(messagePolish);

    return `${messagePolish} already exists!`
}

module.exports.loadUniversityData = async (req, res) => {
    try {
       
        const {universities} = uni
        // res.json(universities)
        for (let index = 0; index < universities.length; index++) {
            const uni = universities[index];
            // console.log(uni);
            const university = new University(uni) 
            await university.save()
        }
        res.send("done")
    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern) })
        return res.status(500).send("issues adding records")
    }
}

module.exports.loadCollegeData = async (req, res) => {
    try {
       
        const {colleges} = collegesData
        for (let index = 0; index < colleges.length; index++) {
            const college = colleges[index];
            const newCollege = new College(college) 
            await newCollege.save()
        }
        res.send("done")
    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern) })
        return res.status(500).send("issues adding records")
    }
}

module.exports.loadPolytechnicsData = async (req, res) => {
    try {
        console.log("ply route");
        const {polytechnics} = polytechnicsData
        console.log(polytechnics.length);
        for (let index = 0; index < polytechnics.length; index++) {
            const polytechnic = polytechnics[index];
            const newPolytechnic = new Polytechnic(polytechnic) 
            await newPolytechnic.save()
        }
        res.send("done")
    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern) })
        return res.status(500).send("issues adding records")
    }
}