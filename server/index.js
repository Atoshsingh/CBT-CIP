import express, { urlencoded } from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config({});//Used to load environment variables from a .env file into process.env;
const portNumber = (process.env.PORT) || 3000;// Provinding Default port also for error prevention 
import connectDB from "./utils/db.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app ,server} from "./socket/socket.js";

// Default mdlewares

app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser()  )

const corsOptions = {
    origin: "http://localhost:5173", // Removed the extra space here
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.get("/",(req,res)=>{
    res.status(200).json({info:"Hello this is Aashutosh from backend "})
})


//will perform All changes of user here
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute); 
app.use("/api/v1/user",userRoute);

server.listen(portNumber,()=>{
    console.log("port is ,", process.env.PORT); //output - 8000
    console.log(`Server running on port ${portNumber}`) // but why here showing 3000
    // console.log(process.env.MONGO_URI)
    connectDB();
})


/* 
The typical use case for this high speed Node-API module is to convert large images in common formats to smaller,
 web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions.
*/