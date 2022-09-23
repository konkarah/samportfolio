//brad traversy

const router = require('express').Router()
const User = require('../model/User')
const path = require('path')
const Joi = require('joi')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcrypt') 

router.get('/register', (req, res)=> {
    res.render('register')
})

router.post('/register', async (req,res)=> {
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
        res.send(savedUser, {user: user})
    }catch(err){
        res.render('register', {user: user, err: err})
    }
})
router.get('/login', (req,res)=> {
    res.render('login')
})

module.exports = router