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
                
                const token = jwt.sign({id},process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRESIN
                })
                console.log(`The token is ` + token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions)
                res.status(200).redirect('/')
            }
        })

    } catch(error) {
        console.log(error)
    }
}