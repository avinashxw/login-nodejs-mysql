const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASENAME
})

exports.register = (req,res) => {
    //console.log(req.body)
    const {
        name, email, password, passwordconfirm
    } = req.body

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

exports.login = async (req,res) => {

    try {
        const { email, password  } = req.body
        console.log(req.body)
        if(!email || !password) {
            return res.status(400).render('signin', {
                message: `Please input an email address & password to proceed!`
            })
        }

        db.query('SELECT * FROM tbl_user WHERE email = ?', [email], async (error, result) => {
            console.log(result)
            if(!result || (!await bcrypt.compare(password, result[0].password))) {
                res.status(401).render('signin', {
                    message: `The email address or password is incorrect!`
                })
            }
            else {
                const id = result[0].id
                
            }
        })

    } catch(error) {
        console.log(error)
    }
}