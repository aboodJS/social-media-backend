const express = require("express")
const User = require("../models/user")
const Post = require("../models/post")
const auth = require('./auth')
require("dotenv").config();
const cors = require("cors")
const crypto = require('bcrypt')
const { neon } = require("@neondatabase/serverless");
const app = express()
app.use(express.json())
app.use(cors())




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
            if (result === true) {
                const token = auth.createToken({ username: loginData.name }, process.env.SECRET_KEY, "15m")
                res.json({token: token})   
            }else {
                res.send("wrong password")
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send(`${error}`)
    }
})


app.post("/posts/add", async (req,res) => {
    try {
        const post = new Post(req.body.title, req.body.postBody)
        const result = await sql`INSERT INTO posts (title, body) VALUES (${post.title}, ${post.postBody})`
        res.send(post)
        
    } catch (error) {
        res.send(`error: ${error}`)
        
    }
})

app.get('/posts', async (req,res) => {
    try {
        const result = await sql`SELECT * FROM posts`
        res.send(result)
    } catch (error) {
        res.send(`error: ${error}`)
    }
})


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})

