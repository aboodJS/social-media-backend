function logData(req, res, next) {
    console.log(req.cookies)
    next()
}

module.exports = logData