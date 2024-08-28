import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
const connectDB = async()=>{
    try{
        // console.log("hello world")
        // console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database successfully connected!");
    }
    catch(error){
        console.log("getting error i connecting to db ", error);
    }
}
export default connectDB;