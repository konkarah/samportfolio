/*if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}*/

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const users = require('./routes/users')
const final = require('./routes/user')
const session = require('express-session');
const signalschema = require('./model/signal')
const statususer = require('./model/User')

//import routes
const authRoute = require('./routes/auth')

//connect to db
mongoose.connect('mongodb+srv://Lore:1234@cluster0.zzszjkd.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true}) 
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log(err))

app.use(express.static(__dirname + '/public'));
app.use(cors())
app.use(bodyParser.json())
//ejs
/*app.use(expressLayouts)
app.set('view engine', 'ejs')*/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded( { extended : true}));

//session variable
app.use(session({
    secret:'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

//middleware
app.use(express.json())

//route middlware
app.use('/api/user', authRoute)
app.use('/users', users)
app.use('/final', final)

//const users = [];

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, './index.html'));
    res.render('home')
})

app.get('/signin', (req, res)=> {
    res.sendFile(path.join(__dirname, './signin.html'));
})

/*app.get('/admin', (req,res)=> {
    res.render('admin')
})*/

app.post('/admin', async(req,res)=> {
    const signal = req.body.signals

    const savedsigal = new signalschema({
        signal: signal
    })

    try{
        await savedsigal.save()
        res.send("Signal posted successfully")
    }catch(err){
        res.send(err)
    }
})

app.post('/changestatus', async(req,res)=>{
    const email = {email:req.body.email}
    const status = {status:req.body.status}

    await statususer.findOneAndUpdate(email, status, {
        new: true,
        upsert: true 
    })
    res.render('adminres', {
        status: "status changed"
    })

    /*statususer.findOne({
        email: email
      }).then(
        user => {
            if(!user){
                console.log("user not found")
            }else{
                statususer.
            }
        }
      )*/
})

app.get('/tcs', (req,res)=> {
    const file = `./public/COPY TRADING TERMS AND CONDITIONS.pdf`;
    res.download(file); // Set disposition and send it.
})

app.listen(process.env.PORT || 3015, () => {
    console.log('Server is running on port 3015...');
});