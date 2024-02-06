// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from './app.js'

dotenv.config({
    path: './env'
})


//aync func always returns a promise
connectDB()
.then(
    //if success then listen
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
)
.catch(
    //if connection fails then console log it
    (err) => {
        console.log("MONGO db connection failed!!!",err);
    }
)















// import express from "express"

// const app = express()

// ;(async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERRR:",error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     }catch(error){
//         console.log("ERROR: ",error)
//         throw err
//     }
// })()

