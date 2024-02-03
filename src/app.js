import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app= express()

app.use(cors({
    //note here we pass an onject in cors to define
    //from which front end url we are allowing dealing with
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//this will allow app to accept json
app.use(express.json({
    limit : "16kb"
}))

//to reduce complexities introduced by accepting url
app.use(urlencoded({extended:true,limit:"16kb"}))

//used to store random stuff in public folder
app.use(express.static("public"))

app.use(cookieParser())

export {app}