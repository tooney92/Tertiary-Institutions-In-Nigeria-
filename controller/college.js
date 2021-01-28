const express = require("express")
const router = express.Router()
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const webtoken = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const College = require("../model/college")


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

module.exports.allColleges = async (req, res) => {
    try {
       
        const colleges =  await College.find().select("name city code")
        res.send(colleges)

    } catch (error) {
        console.log(error);
        return res.status(500).send("issues getting records")
    }
}

module.exports.addCollege = async (req, res) => {
    try {
       
        const v = new Validator(req.body, {
            "colleges": "required|array",
        })

        const match = await v.check()
        if (!match) return res.status(400).json({ error: VerrorsMessageFormatter(v.errors) })
        
        const colleges = req.body.colleges
        for (let index = 0; index < colleges.length; index++) {
            const college = colleges[index];
            const newCollege = new College(college) 
            await newCollege.save()
        }
        res.send("colleges added successfully")
    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern), duplicateEntry: error.keyValue })
        if(error._message === 'College validation failed') return res.status(400).json({ error: "please ensure the city, code and name properties of the college is  sent"})
        return res.status(500).send("issues adding records")
    }
}

module.exports.updateCollege = async (req, res) => {
    try {
       
        if(!req.params.id) return res.status(400).send("Id not provided")
        const college = await College.findOneAndUpdate({_id: req.params.id},  {$set: req.body}, {new: true})
        console.log(college);
        if(!college) return res.status(400).send("unable to update record")
        res.json({college})

    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(400).json({ error: duplicateMessageFormatter(error.keyPattern) })
        if(error.kind == 'ObjectId') return res.status(400).json({ error: "invalid ID" })
        return res.status(500).send("issues updating record ")
    }
}

module.exports.removeCollege = async (req, res) => {
    try {
        await College.findByIdAndDelete({_id: req.params.id})
        res.send("record deleted successfully")
    } catch (error) {
        console.log(error);
        return res.status(500).send("issues deleting record")
    }
}



