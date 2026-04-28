const express = require("express")
const User = require("./models/user")
const Post = require("./models/post")
require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const app = express()
app.use(express.json())

const sql = neon(process.env.DATABASE_URL);

app.get("/", async(req,res) => {
    const result = await sql`SELECT * FROM users`;
    res.send(`test response: ${JSON.stringify(result)}`)
})




app.post("/Signup", async(req,res) => {
    console.log(req.body)
    if (req.body) {
        const user = new User(req.body.name, req.body.password)
        const result = await sql`INSERT INTO users (username, passwords) VALUES (${user.name}, ${user.password})`
        res.send(result)
        
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


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})

