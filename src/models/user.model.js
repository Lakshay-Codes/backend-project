//add mongoose to create schema and model
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//how to use jwt and bcrypt?
//use middlewares just before saving data


//create a design on white paper
const userSchema = new Schema(
    {
        //we want to use username to search stuff so add index for efficient search
        //but it will slow down the other processes a bit
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, //cloudinary url
            required : true
        },
        coverImage : {
            type : String, //cloudinary url
        },
        //its a complex feature to deal with
        //we need mongoose-aggregate-paginate-v2 installed
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String,
            required : [true,'Password is required']
        },
        refreshToken : {
            type : String
        }
    },
    //in order to add created at and updated at use timestamps option
    {
        timestamps : true
    }
)

//pre to saving run this function inside this middleware!
//dont use arrow functions here as we need access to this pointer
//we make it async as it takes time to process bcrypt
//we have a next flag which tells system to run the next decided process
userSchema.pre("save",async function(next){
    //problem is after every saving it will change password
    //we want to encrypt only when we modify password
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    //it takes time so make it await
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this.id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this.id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//create the real solid model
export const User = mongoose.model("User",userSchema);