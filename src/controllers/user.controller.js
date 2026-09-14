import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uplodOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const registerUser = asyncHandler(async (req, res) => {
    // GET USER detail from frontend or postman
    // validation - not empty, email format, password length, etc
    // check if user already exists: username,email
    // check for images , check for avatar
    // upload them to cloudinary ,avatar
    // create user object - create a new user in the database
    // remove password and refresh token field from response
    // check for user creation 
    // return response

    const  {fullName,email,username,password} = req.body
    console.log("eamil",email);
    if(
        [fullName,email,username,password].some((field) => 
            !field || field.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }
    const existingUser = await User.findOne({
        $or: [{email},{username}]
    });
    if(existingUser){
        throw new ApiError(409,"User already exists");
    }
    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    let avatar = null;
    let coverImage = null;

    if (avatarPath) {
        avatar = await uplodOnCloudinary(avatarPath, "avatars");
    }

    if (coverImagePath) {
        coverImage = await uplodOnCloudinary(coverImagePath, "coverImages");
    }

    const defaultAvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80";
    const defaultCoverUrl = "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80";

    const user = await User.create({
        fullName,
        email,
        avatar: avatar?.url || defaultAvatarUrl,
        coverImage: coverImage?.url || defaultCoverUrl,
        username :username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"User creation failed");
    }

    return res.status(201).json(
        new ApiResponse(201,"User created successfully",createdUser)
    )
})
   

export { registerUser };