//import
const mongoose = require("mongoose")

// schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true }
})

// model
const Customer = mongoose.model("Customer", customerSchema)

// customer
module.exports = Customer 