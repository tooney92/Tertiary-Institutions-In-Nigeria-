const mongoose = require("mongoose")

const collegeSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
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
module.exports = mongoose.model("College", collegeSchema)

