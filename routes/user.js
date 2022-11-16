//webdevsimplified

/*if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodoverride = require('method-override');
const users = require('../model/User')
const {registerValidation, loginValidation} = require('../validation')
const dotenv = require('dotenv').config()
const savedsigals = require('../model/signal')


const initialisepassport = require('../passport-config');
const { appendFile } = require('fs');
initialisepassport(
    passport
);

router.use(cors());
router.use(methodoverride('_method'));
router.use( express.static( "public" ) );
router.use(express.urlencoded({extended: false}));
router.use(flash());
router.use(session({
    secret: process.env.Token_secret,
    resave: false,
    saveUninitialized: false
    //store: new MemoryStore({checkPeriod: 86400000})
}));

router.use(express.json())
router.use(passport.initialize());
router.use(passport.session());

//const users = [];

router.get('/', (req, res) => {
    res.send("hello world");
});

 
router.get('/signin', checknotauthenticated,(req, res) => {
    //res.sendFile(path.join(__dirname, './signin.html'));
    res.render('login')
});

router.post('/signin',checknotauthenticated, passport.authenticate('local', {
    //successRedirect: 'index',
    failureRedirect: 'signin',
    failureFlash: true
}),(req,res)=>{
    if(req.user.status === 1) {
        res.redirect('index');
      }
      if (req.user.status === 0) {
        res.send("Please pay to login")
      }
      if(req.user.status === 2){
          res.render('admin')
      }
}
);

router.get('/signup', (req, res) => {
    res.render('register')
});

router.post('/signup',checknotauthenticated, async (req, res) => {
    /*try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10);

        users.push({
            id: Date.now().toString(),
            Fname: req.body.firstname,
            Lname: req.body.lastname,
            email: req.body.email,
            password: hashedpassword
        })
        res.redirect('signin');
    } catch(error)  {
        res.redirect('signup');
        console.log(error);
    }
    console.log(users);*/

    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    //check if the user is already in db
    const emailExists = await users.findOne({email: req.body.email})
    if(emailExists) return res.status(400).render('register', {err: "email already exists"})

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassord = await bcrypt.hash(req.body.password, salt)

    const user = new users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassord
    });
    try{
        const savedUser = await user.save()
        res.render('login')
    }catch(err){
        res.render('register', {err: err})
    }
})


router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});


router.get('/savedsignals',async(req, res)=> {
    try {
        const results = await savedsigals.find({}).limit(2);
        console.log(results);
      } catch (err) {
        throw err;
      }
})

router.get('/index',checkauthenticated, async(req,res)=> {
if(req.user.status==1){
    var signalresults
    try {
        signalresults = await savedsigals.find({}).limit(2);
        //console.log(results);
      } catch (err) {
        throw err;
      }

    res.render('index', {
        link: "https://samkenyafx.com/"+req.user.userid,
        signals: signalresults
    })
}if(req.user.status==0 || req.user == null || req.user == undefined || req.user == " "){
    res.render('home')
}
})
router.get('/trial', (req, res)=> {
    res.send("hello")
})


function checkauthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('signin');
}

function checknotauthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('index');
    }
    next();
}


module.exports = router;