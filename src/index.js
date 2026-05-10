const express = require("express")
const User = require("../models/user")
const Post = require("../models/post")
const auth = require('./auth')
require("dotenv").config();
const cors = require("cors")
const crypto = require('bcrypt')
const cookieParser = require("cookie-parser")
const { neon } = require("@neondatabase/serverless");
const checkToken = require("./middleware")
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: "http://localhost:5173"}))





const sql = neon(process.env.DATABASE_URL);

app.get("/",async(req,res) => {
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
        const response = await sql`SELECT * FROM users WHERE username=${loginData.name.trim()}`
        crypto.compare(loginData.password, response[0].password, async(err, result) => {
            if (result === true) {
                const token = auth.createToken({ username: loginData.name }, process.env.SECRET_KEY, "15m")
                const refreshToken = auth.createToken({ username: loginData.name }, process.env.SECRET_KEY, "7d")
                
                res.json({token: token, cookie: refreshToken})   
            }else {
                res.status(401).send({"msg": "wrong password"})
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({msg:`${error}`})
    }
})


app.post("/posts/add", checkToken, async (req,res) => {
    try {
        const post = new Post(req.body.title, req.body.postBody)
        const result = await sql`INSERT INTO posts (title, body) VALUES (${post.title}, ${post.postBody})`        
    } catch (error) {
        res.status(500).json({msg: `error: ${error}`})  
    }
})

app.get('/posts', async (req,res) => {
    try {
        const result = await sql`SELECT * FROM posts`
        res.send(result)
    } catch (error) {
        res.status(500).json({error: `${error}`})
    }
})


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})

