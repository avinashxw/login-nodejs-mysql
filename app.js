const express = require('express')
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')

dotenv.config({ path:'./.env' })

const app = express()

const db = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASENAME
})

const publicDirectory = path.join(__dirname,'./public')
app.use(express.static(publicDirectory))

// Pare URL-encoded bodies (as set by HTML forms)
app.use(express.urlencoded({ extended: false }))
// Parse JSON bodies (as sent by API clients)
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'hbs')

// checks database connection
db.connect((err,res) => {
    if(err) {
        throw err
        console.log(err)
    }
    else {
        console.log('DB connected!')
    }
})

// define routes
app.use('/', require('./routes/page'))
app.use('/auth', require('./routes/auth'))

// server listens
app.listen(4000, () => {
    console.log('Server is running on port 4000')
})