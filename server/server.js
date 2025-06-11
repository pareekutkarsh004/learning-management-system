console.log("Nodemon is watching...");
import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/mongodb.js"
import clerkWebhooks from "./controllers/webHooks.js"
import educatorRouter from "./route/educatorRoutes.js"
import { clerkMiddleware } from "@clerk/express"
import connectCloudinary from "./configs/cloudinary.js"

//Initialize express

const app= express()

//connect database

await connectDB()
await connectCloudinary( )

//Middlewares

app.use(cors())
app.use(clerkMiddleware())  

//Routes
app.get('/',(req,res)=>res.send("API working"))
app.post('/clerk', express.json(),clerkWebhooks)
app.use('/api/educator', express.json(),educatorRouter)

//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`Server is running on port: ${PORT}`)
})
