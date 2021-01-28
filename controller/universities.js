const express = require("express")
const router = express.Router()
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const webtoken = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const University = require("../model/university")
const { uni, colleges, polytechnics } = require("../data/data.js")

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

module.exports.allUnis = async (req, res) => {
    try {

        const universities = await University.find().select("name city code")
        res.send(universities)

    } catch (error) {
        console.log(error);
        return res.status(500).send("issues getting records")
    }
}

module.exports.addUni = async (req, res) => {
    try {

        const v = new Validator(req.body, {
            "universities": "required|array",
        })

        const match = await v.check()
        if (!match) return res.status(400).json({ error: VerrorsMessageFormatter(v.errors) })

        const universities = req.body.universities
        for (let index = 0; index < universities.length; index++) {
            const uni = universities[index];
            const university = new University(uni)
            await university.save()
        }
        res.send("Universities added successfully")
    } catch (error) {
        if (error.code === 11000) return res.status(422).json({ error: duplicateMessageFormatter(error.keyPattern), duplicateEntry: error.keyValue })
        if (error._message === 'University validation failed') return res.status(400).json({ error: "please ensure the city, code and name properties of the university is  sent" })
        return res.status(500).send("issues adding records")
    }
}

module.exports.UpdateUni = async (req, res) => {
    try {

        if (!req.params.id) return res.status(400).send("Id not provided")
        console.log(req.body);

        const university = await University.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        if (!university) return res.status(400).send("unable to update record")
        res.json({ university })

    } catch (error) {
        console.log(error);
        if (error.code === 11000) return res.status(400).json({ error: duplicateMessageFormatter(error.keyPattern) })
        if (error.kind == 'ObjectId') return res.status(400).json({ error: "invalid ID" })
        return res.status(500).send("issues updating record ")
    }
}

module.exports.removeUni = async (req, res) => {
    try {

        await University.findByIdAndDelete({ _id: req.params.id })
        res.send("record deleted successfully")


    } catch (error) {
        console.log(error);
        return res.status(500).send("issues deleting record")
    }
}




