const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = (req,res) => {
    console.log(req.body)

    /* const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const passwordconfirm = req.body.passwordconfirm */

    const {
        name, email, password, passwordconfirm
    } = req.body

    const db = mysql.createConnection({
        host: process.env.HOSTNAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASENAME
    })

    db.query('SELECT email from tbl_user WHERE email = ?', [email], async(err,result) => {
        if(err) {
            console.log(err)
        }

        if(result.length > 0) {
            return res.render('register',{
                message: 'The email address has already been registered!'
            })
        }
        else if( password !== passwordconfirm) {
            return res.render('register',{
                message: 'The password & confirm password do not match!'
            })
        }

        let hashedPassword = await bcrypt.hash(password,8)
        console.log(hashedPassword)

        // create user by inserting user details
        db.query('INSERT INTO tbl_user SET ?', {name: name, email:email, password: hashedPassword}, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                console.log(result)
                res.render('register', {
                    message: 'User registered!'
                })
            }
        })
        
    })
}