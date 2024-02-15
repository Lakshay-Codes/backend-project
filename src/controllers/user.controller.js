import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req,res) => {
    // return res.status(200).json({
    //     message: "ok"
    // })
    //Logic for registering user
    //1) Get user details from frontend ---> From PostMan

    const {fullName, email, username, password} = req.body;

    //testing
    // console.log("email: ",email);    

    //2) Validation - Not Empty

    //one way to validate is to check one by one
    // if(fullName===""){
    //     throw new ApiError(400, "fullname is required")
    // }
    
    //another way to validate is this
    if(
        [fullName,email,username,password].some((field) => field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")        
    }

    //3) Check if user already exists ---> Check from username & email
    //whenever you want to check if user already exists
    //then go to the model of the user and then
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    //4) Check for images, check for avatar
    //with the help of multer we have more options in req
    //this gives us path of the saved file using multer
    //? means there is a possiblity of unavailablity of paths
    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    //since coverImage array this way cant be ensured we need to do
    //some other thing -> here optional chaining gave issues
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //use let to handle scope issue
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath= req.files.coverImage[0].path;
    }


    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    // console.log(req.files);

    //5) Upload them to cloudinary, avatar
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    //6) Create user object - Create entry in DB
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //7) Remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //8) Check for use creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    //9) Return res else error
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Sucessfully")
    );
} )

export {registerUser}