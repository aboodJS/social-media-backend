const jsonwebtoken = require("jsonwebtoken")

require("dotenv").config();

function checkToken(req, res, next) {
    try {
        console.log(req.cookies)
        const result = jsonwebtoken.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)
        console.log("verified")
        next()
    } catch (error) {
        console.log(error)
        res.send("session expired!")
    }
    
}

module.exports = checkToken