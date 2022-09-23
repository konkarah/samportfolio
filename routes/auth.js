//random video from devids

const router = require('express').Router()
const User = require('../model/User')
const Joi = require('joi')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/register', async (req,res) => {

    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    //check if the user is already in db
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) return res.status(400).send("Email already exists")

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassord = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassord
    });
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async(req,res) => {
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if the user is already in db
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Email does not exists")

    //compare password 
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send("Invalid Password")

    /*const token = jwt.sign({_id: user._id}, process.env.Token_secret)

    res.header('auth-token', token)*/
    res.send("Successfully logged in")
})

module.exports = router 