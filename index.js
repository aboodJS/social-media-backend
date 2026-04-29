const express = require("express")
const User = require("./models/user")
const Post = require("./models/post")
require("dotenv").config();
const crypto = require('bcrypt')
const { neon } = require("@neondatabase/serverless");
const app = express()
app.use(express.json())



const sql = neon(process.env.DATABASE_URL);

app.get("/", async(req,res) => {
    const result = await sql`SELECT * FROM users`;
    res.send(`test response: ${JSON.stringify(result)}`)
})




app.post("/signup", async(req,res) => {

    try {
            const user = new User(req.body.name, req.body.password)
            crypto.hash(user.password, 12, async (err, hash) => {
            const result = await sql`INSERT INTO users (username, passwords) VALUES (${user.name}, ${hash})`
            res.send(result)
        })
    } catch (error) {
         console.log(error)
        res.status(500).send(`${error}`)
        
    }
})

app.post("/login", async (req,res) => {
    try {
        const loginData = req.body
        const response = await sql`SELECT * FROM users WHERE username=${loginData.name}`
        crypto.compare(loginData.password, response[0].passwords, async(err, result) => {
            res.send("done")
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(`${error}`)
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


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})

