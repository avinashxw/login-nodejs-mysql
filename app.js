const express = require('express')
const mysql = require('mysql')

const app = express()

app.get('/', (req,res) => {
    res.send('<h1>Welcome to the world of programming!</h1>')
})

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})