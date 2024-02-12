import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

//in case of DB data takes time to come so must use 
//async await
const connectDB = async () => {
    //errors are inevitable
    //so try and catch are must
    //lets build utilty of it
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected!!`);
    }catch(error){
        console.log("MONGODB connection FAILED",error);
        process.exit(1)
    }
}

export default connectDB