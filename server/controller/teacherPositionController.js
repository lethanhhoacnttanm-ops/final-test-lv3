import teacherPositionModel from "../model/teacherPosition.js";
import crypto from 'crypto'

const teacherPositionController = {
    getTeacherPositions: async (req, res) => {
        try {
            const positions = await teacherPositionModel.find({});

            if(positions.length === 0){
                return res.status(403).json({
                    message: "Không tim thấy bất cứ dữ liệu liên quan đến vị trí !!!"
                })
            }
            res.status(200).json({
                success: true,
                data: positions
            });
        } catch (error) {
            console.log("Error from server")
            console.error(message)
            return res.status(500).json({
                message: error.message
            })
        }
    },
    postTeacherPosition: async (req, res) => {
        try {
            const { name, code, des, active } = req.body;
            if (!name || !code || !des || active === undefined) {
                return res.status(400).json({ message: "All fields are required." });
            }

            if (code.length > 10) {
                return res.status(403).json({ message: "Mã code không được quá 10 kí tự" })
            }

            const newPosition = new teacherPositionModel({
                name,
                code,
                des,
                isActive: active
            });
            await newPosition.save();
            res.status(201).json({
                success: true, 
                data: newPosition
            });
        } catch (error) {
            res.status(500).json({ message: "Error from  server" });
        }
    }
};

export default teacherPositionController;
