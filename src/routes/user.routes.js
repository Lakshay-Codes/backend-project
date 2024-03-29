import {Router} from 'express';
import {registerUser,loginUser,logoutUser,refreshAccessToken} from '../controllers/user.controller.js'
//use multer to store images locally it is a middleware
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

//when we hit register route we run registerUser controller
//but middleware works just before this execution
//if user shares data with names avatar and/or coverImage 
//then upload them on local storage then run registerUser
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name: "coverImage",
        maxCount:1
    }
]),registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router