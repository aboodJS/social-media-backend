const jsonwebtoken = require("jsonwebtoken")

require("dotenv").config();

function checkToken(req, res, next) {
    try {
        console.log(req.cookies)
        const result = jsonwebtoken.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY, function (err, decoded) {
            if (!err) {
                console.log(decoded)
                next()
            } else {
                console.log(err)
                res.json({msg: `${err}`})
            }
        })
    } catch (error) {
        console.log(error)
        res.json({msg: "session expired!"})
    }
    
}



module.exports = checkToken