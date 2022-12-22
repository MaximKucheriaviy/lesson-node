const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Contact = require("./modelContact");
const {User} = require("./modelUser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("./auth");

require("dotenv").config();

const {DB_URL, SECRET_WORD} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/contacts", auth, async (req, res) => {
    const result = await Contact.find({
        owner: req.user._id
    });
    res.send(result);
})

app.post("/contacts", auth, async (req, res) => {
    console.log(req.body);
    const result = await Contact.create({...req.body, owner: req.user._id});
    res.send({
        data: result
    })
})

app.delete("/contacts/:id", auth, async (req, res) => {
    const result = await Contact.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id
    });
    res.send({
        data: result
    })
})

app.post("/users/signup", async (req, res) => {
    const {name, email, password} = req.body;
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await User.create({
        name,
        password: hashPassword,
        email,
    })
    const token = jwt.sign({
        id: newUser._id
    }, SECRET_WORD);
    await User.findByIdAndUpdate(newUser._id, {
        token
    })
    res.json({
       token
    })
})

app.post("/users/login", auth, async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: "User not exist"
        })
    }
    if(!bcrypt.compareSync(password, user.password)){
        return res.status(400).json({
            message: "User not exist"
        })
    }
    const token = jwt.sign({
        id: user._id
    }, SECRET_WORD);
    await User.findByIdAndUpdate(user._id, {
        token
    })
    res.json({
       token
    })
})

app.get("/users/current", auth, async (req, res) => {
    const {email, name} = req.user
    res.json({
        email,
        name
    });
})




mongoose.set('strictQuery', false);
mongoose.connect(DB_URL, () => {
    console.log("DB connected");
})

app.listen(3001, () => {
    console.log("Server is runing");
})