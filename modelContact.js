const mongoose = require("mongoose");

const schemaContact =  mongoose.Schema({
    name: String,
    phone: String,
    owner: mongoose.Schema.Types.ObjectId
});

const Contact = mongoose.model("contact", schemaContact);

module.exports = Contact;