if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(cors());

//bodyparser...................................................
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }))
app.use(bodyParser.json({ limit: "10mb" }))

const uniDataRoute = require("./routes/loadData");
app.use("/loadData", uniDataRoute);

const uniRoute = require("./routes/universities");
app.use("/api/universities", uniRoute);

const collegeRoute = require("./routes/college");
app.use("/api/colleges", collegeRoute);

const polyRoute = require("./routes/poly");
app.use("/api/polytechnics", polyRoute);

//connect to db..........................................................
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
const db = mongoose.connection
db.on("error", error => console.log(error))
db.on("open", () => console.log("Connected to DB"))

//app server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app