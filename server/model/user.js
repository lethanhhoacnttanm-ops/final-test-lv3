import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    address: {
        type: String
    },

    identity: {
        type: String,
        required: true,
        unique: true
    },

    dob: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ["STUDENT", "TEACHER", "ADMIN"],
        default: "STUDENT"
    }
},
{
    timestamps: true
});

const userModel = mongoose.model("user", userSchema, "user");

export default userModel;