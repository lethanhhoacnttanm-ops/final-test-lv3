import mongoose from "mongoose";

const teacherPositionSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    des: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const teacherPositionModel = mongoose.model("teacherPosition", teacherPositionSchema, "teacherPosition");

export default teacherPositionModel;