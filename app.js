const express = require('express')
const path = require('path')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const hbs = require('hbs')

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
app.set('view engine', 'hbs')

db.connect((err,res) => {
    if(err) {
        throw err
        console.log(err)
    }
    else {
        console.log('DB connected!')
    }
})

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/signin', (req,res) => {
    res.render('signin')
})

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})