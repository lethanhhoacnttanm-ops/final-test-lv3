import mongoose from "mongoose";
import userModel from "./user.js";
import teacherPositionModel from "./teacherPosition.js";

const degreeSchema = new mongoose.Schema(
{
    type: {
        type: String,
        enum: ["Cử nhân", "Thạc sĩ", "Giáo sư"],
        required: true
    },
    school: {
        type: String,
        required: true
    },

    major: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    isGraduated: {
        type: Boolean,
        default: true
    }
},
{
    _id: false
});

const teacherSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    },

    teacherPositions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "teacherPosition",
            required: true
        }
    ],

    degrees: [degreeSchema]
},
{
    timestamps: true
});

const teacherModel = mongoose.model(
    "teacher",
    teacherSchema,
    "teacher"
);

export default teacherModel;