const jwt = require("jsonwebtoken");
const {User} = require("./modelUser");
require("dotenv").config();

const {SECRET_WORD} = process.env;


async function auth(req, res, next){
    const payload = jwt.verify(req.headers.authorization, SECRET_WORD);
    const verifyUser = await User.findById(payload.id);
    if(!verifyUser){
        return res.status(400).json({
            message: "User not verify"
        })
    }
    req.user = verifyUser;
    next();
}

module.exports = auth;