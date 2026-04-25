const express = require("express")

const app = express()

function sendGreeting(name) {
    return `hello, ${name}`
}

app.get("/", (req,res) => {
    res.send(sendGreeting("Abdallah"))
})


app.listen(3000)

module.exports = sendGreeting