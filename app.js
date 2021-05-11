const express = require('express')
const mysql = require('mysql')
const bodyparser = require('body-parser')

const app = express()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginnodemysql'
})

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
    res.send('<h1>Welcome to the world of programming!</h1>')
})

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})