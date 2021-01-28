const mongoose = require("mongoose")

const universitySchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true
    },
    city:{
        type:String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true 
    },
    addedBy:{
        type: String
        // required: true
    }
},{
    timestamps: true
})

//added stuff here
module.exports = mongoose.model("University", universitySchema)

