const {Router} = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const {UserModel} = require("../models/User.model")

const userController = Router();


userController.post("/signup", (req, res) => {
    const {email, bookingId} = req.body;

    bcrypt.hash(bookingId, 5, async function(err, hash) {
        if(err){
            res.send("Something went wrong, plz try again later")
        }
        const user = new UserModel({
            email,
            bookingId : hash,
            
        })
        try{
            await user.save()
            res.json({msg : "Signup successfull"})
        }
        catch(err){
            console.log(err)
            res.send("Something went wrong, plz try again")
        }
       
    });
})

userController.post("/login", async (req, res) => {
    const {email, bookingId} = req.body;
    const user = await UserModel.findOne({email})
    const hash = user.bookingId
    bcrypt.compare(bookingId, hash, function(err, result) {
        if(err){
            res.send("Something went wrong, plz try again later")
        }
        if(result){
            const token = jwt.sign({ userId : user._id }, process.env.SECRET);
            res.json({message : "Login successfull", token})
        }
        else{
            res.send("Invalid credentials, plz signup if you haven't")
        }
    });
    
})

module.exports = {
    userController
}