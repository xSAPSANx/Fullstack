import { request } from "express";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        request : true,
    },
    email: {
        type: String,
        required : true,
        unique : true,
    },
    passwordHash: {
        type: String,
         required:true,       
    },
    avatarUrl:String,
},
{
timestamps:true,
},
);

export default mongoose.model("User",UserSchema);