if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const users = require('./routes/users')
const final = require('./routes/user')

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

app.set('view engine', 'ejs');



//middleware
app.use(express.json())

//route middlware
app.use('/api/user', authRoute)
app.use('/users', users)
app.use('/final', final)

//const users = [];

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
})

app.get('/signin', (req, res)=> {
    res.sendFile(path.join(__dirname, './signin.html'));
})

app.listen(process.env.PORT || 3015, () => {
    console.log('Server is running on port 3000...');
});