//basically we will create a function to deal with db
//but we dont want to waste in async await try catch
//so make a wrapper function's function to pass a function
//to get premade async await try catch
const asyncHandler = (resquestHandler) => {
    return (req,res,next) => {
        //same as async 
        //same as try
        //same as catch
        Promise 
        .resolve(resquestHandler(req,res,next))
        .catch((err) => next(err))
    }
}


export {asyncHandler}

//another way to do it
//try catch way
//from where did we get req res and next ?
// const asyncHandler = (fn) => async (req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 500)
//         .json({
//             success: false,
//             message: err.message
//         })
//     }
// }

