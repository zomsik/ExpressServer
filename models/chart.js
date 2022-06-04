const mongoose = require("mongoose")

const chartSchema = new mongoose.Schema({
    login: { type: String, required: true },
    chartTitle: { type: String, required: true},
    chartData: {type: Object, required: true}
})


const Chart = mongoose.model("Chart", chartSchema)



module.exports = { Chart }