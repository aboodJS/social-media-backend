const jwt = require("jsonwebtoken")

function createToken (body, key, exp) {
    try {
        const token = jwt.sign(body, key, { expiresIn: exp })
        return token
        
    } catch (error) {
        return error
    }
}

function verifyToken(token, key) {
    try {
        const result = jwt.verify(token, key)
        return result
        
    } catch (error) {
        return error
    }
}


module.exports = {createToken, verifyToken}