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


function createRandomName() {
    const firstParts = ["monster", "master", "thing"]
    const secondParts = ["fruit", "carnivour", "pokemon"]
    const random = Math.round(Math.random() * 2)

    return `${firstParts[random]}${secondParts[random]}`
}

console.log(createRandomName(3))


module.exports = {createToken, verifyToken}