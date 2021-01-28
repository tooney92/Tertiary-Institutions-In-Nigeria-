const express = require("express")
const router = express.Router()
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const webtoken = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const Polytechnic = require("../model/polytechnic")


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

module.exports.allPoly = async (req, res) => {
    try {
       
        const poly =  await Polytechnic.find().select("name city code")
        res.send(poly)

    } catch (error) {
        console.log(error);
        return res.status(500).send("issues getting records")
    }
}

module.exports.addPoly = async (req, res) => {
    try {
       
        const v = new Validator(req.body, {
            "polytechnics": "required|array",
        })

        const match = await v.check()
        if (!match) return res.status(400).json({ error: VerrorsMessageFormatter(v.errors) })
        
        const polytechnics = req.body.polytechnics
        for (let index = 0; index < polytechnics.length; index++) {
            const poly = polytechnics[index];
            const newPolytechnic = new Polytechnic(poly) 
            await newPolytechnic.save()
        }
        res.send("record(s) added successfully")
    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern), duplicateEntry: error.keyValue })
        if(error._message === 'Polytechnic validation failed') return res.status(400).json({ error: "please ensure the city, code and name properties of the college is  sent"})
        return res.status(500).send("issues adding records")
    }
}

module.exports.updatePoly = async (req, res) => {
    try {
       
        if(!req.params.id) return res.status(400).send("Id not provided")
        const polytechnic = await Polytechnic.findOneAndUpdate({_id: req.params.id},  {$set: req.body}, {new: true})
        if(!polytechnic) return res.status(400).send("unable to update record")
        res.json({polytechnic})

    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(400).json({ error: duplicateMessageFormatter(error.keyPattern) })
        if(error.kind == 'ObjectId') return res.status(400).json({ error: "invalid ID" })
        return res.status(500).send("issues updating record ")
    }
}

module.exports.removePoly = async (req, res) => {
    try {
        await Polytechnic.findByIdAndDelete({_id: req.params.id})
        res.send("record deleted successfully")
    } catch (error) {
        console.log(error);
        return res.status(500).send("issues deleting record")
    }
}



