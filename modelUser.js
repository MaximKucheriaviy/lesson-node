const {Schema, model} = require("mongoose");

const userShema = Schema({
    name: String,
    email: String,
    password: String,
    token: String
})

const UserModel = model("user", userShema);

module.exports = {
    User: UserModel
}