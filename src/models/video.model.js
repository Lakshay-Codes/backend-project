import mongoose,{Schema} from "mongoose";
//use this functionality here
import mongooseAggregatePaginate
from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        //although we can store video file media in mongoDB but still its a 
        //better practice to do it in 3rd party app
        videoFile : {
            type : String, //cloudinary url
            required : true
        },
        thumbnail : {
            type : String, //cloudinary url
            required : true
        },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        duration : {
            type : Number,
            required : true
        },
        view : {
            type : Number,
            default : 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)

//now we can use mongooseAgg as plugin for adv queries
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);