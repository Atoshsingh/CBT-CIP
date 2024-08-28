import bcrypt from "bcryptjs";
import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js"
  

// Logout System
export const logout  = async (_ , res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully!",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

// new or nudie user will create there account 
export const register = async (req,res)=>{
    try {
        console.log("Register Button clicked ")
        const {username , email , password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message:"Something is missing, Please check again!",
                success:false
            })
        }
        const dbemail  = await User.findOne({email});
        if(dbemail){
            return res.status(401).json({
                message:"Try diffrent email It's already there",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,email,
            password:hashedPassword
        })
        return res.status(201).json({
            message:"Account created successfully.",
            success:true
        })

    } catch (error) {
        console.log("Getting error while registring " , error);
    }
}

//User which has an account will able to access that 
export const login = async (req,res)=>{
    try {
        const { email , password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"Something is missing, Please check again!",
                success:false
            })
        }
        let user  = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false
            })
        }
        const isPasswordMatch = await  bcrypt.compare(password , user.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false
            })
        }
        //destructring an obj for sending with final responce 
        // const populatedPosts = await Promise.all(
        //     user.posts.map( async (postId)=>{
        //         const post = await Post.findById(postId);
        //         if(post.auther.equals(user._id)){
        //             return post;
        //         }
        //         return null;
        //     })
        // )

        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePicture:user.profilePicture,
            followers:user.followers,
            following:user.following,
            post:user.post,
            
        }

        //use to check user is authenticated or not (for limited period of time. )
        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        //this will for one day 
        return res.cookie('token',token,{httpOnly:"true",sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
        })

    } catch (error) {
        console.log("Getting error while logging " , error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        console.log("Edit profile Clicked!")
        const userId = req.id;
        console.log(userId);
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message:"response declined!",
            error:error
        })
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};


export const followOrUnfollow = async (req, res) => {
    try {
        const Owner = req.id; 
        const friend = req.params.id; 
        if (Owner === friend) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(Owner);
        const targetUser = await User.findById(friend);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(friend);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: Owner }, { $pull: { following: friend } }),
                User.updateOne({ _id: friend }, { $pull: { followers: Owner } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: Owner }, { $push: { following: friend } }),
                User.updateOne({ _id: friend }, { $push: { followers: Owner } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}
