const express = require("express")
const User = require("./models/user")
const Post = require("./models/post")
const app = express()
app.use(express.json())



app.post("/Signup", (req,res) => {
    console.log(req.body)
    if (req.body) {
        const user = new User(req.body.name, req.body.password)
        res.send(user)
        
    } else {
        res.send("error from: ", req.path)
    }
})


app.post("/Posts/add", (req,res) => {
    if (req.body) {
        const post = new Post(req.body.title, req.body.postBody, req.body.score)
        res.send(post)
    } else {
        res.send('error from: ', req.path)
    }
})


app.listen(3000)

