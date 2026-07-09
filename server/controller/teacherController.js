import dayjs from "dayjs";
import teacherModel from "../model/teacher.js";
import userModel from "../model/user.js";
import crypto from "crypto";

const teacherController = {
    getTeachers: async (req, res) => {
        try {
            const pageNumber = Number(req.query.page);
            const pageSize = Number(req.query.limit);
            const skip = (pageNumber - 1) * pageSize;
            const query = {
                $or: [
                    { isDelete: false },
                    { isDelete: { $exists: false } }
                ]
            };

            const activeQuery = {
                ...query,
                $or: [
                    { isActive: true },
                    { isActive: { $exists: false } }
                ]
            };

            const inactiveQuery = {
                ...query,
                isActive: false
            };

            const [teachers, totalItems, activeCount, inactiveCount] = await Promise.all([
                teacherModel.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(pageSize),
                teacherModel.countDocuments(query),
                teacherModel.countDocuments(activeQuery),
                teacherModel.countDocuments(inactiveQuery)
            ]);

            const getUserDetails = async (teacher) => {
                if (!teacher.userId) return {};
                const user = await userModel.findById(teacher.userId);
                return user;
            };

            const teachersWithDetails = await Promise.all(
                teachers.map(async (teacher) => {
                    const userDetail = await getUserDetails(teacher);
                    return { ...teacher._doc, userDetail };
                })
            );

            res.status(200).json({
                success: true,
                data: teachersWithDetails,
                activeCount,
                inactiveCount,
                pagination: {
                    totalItems,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalItems / pageSize),
                    pageSize: pageSize
                }
            });

        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    postUploadCloud: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No files were uploaded!' });
        }
        res.status(200).json({
            message: 'Upload successful!',
            fileUrl: req.file.path
        });
    },

    postTeacher: async (req, res) => {
        try {
            const { name, email, phoneNumber, address, identity, image, dob, teacherPositions, degrees } = req.body;

            if (!name || !email || !phoneNumber || !address || !identity || !image || !dob || !teacherPositions || !degrees) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const firstDegree = degrees?.[0] || {};
            const { type, school, major, year, isGraduated } = firstDegree;

            const isEmailExist = await teacherModel.findOne({ email });

            if (isEmailExist) {
                return res.status(400).json({ message: "Email already exists." });
            }

            const newUser = await userModel.create({
                name,
                email,
                phoneNumber,
                address,
                identity,
                dob,
                role: "TEACHER"
            })

            const startD = dayjs().toISOString();

            const endD = dayjs().add(4, "year").toISOString()

            if (newUser.role === "TEACHER") {

                const newTeacher = await teacherModel.create({
                    userId: newUser._id,
                    code: crypto.randomInt(1000000000, 10000000000).toString(),
                    startDate: startD,
                    endDate: endD,
                    image,
                    teacherPositions,
                    degrees: [
                        {
                            type,
                            school,
                            major,
                            year,
                            isGraduated: isGraduated
                        }
                    ]
                })

                res.status(201).json({
                    success: true,
                    message: "Thanh cong tao teacher",
                    dataUser: newUser,
                    teacherInfo: newTeacher
                });
            } else {
                throw new error("Khong phải role TEACHER")
            }




        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTeacher: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, phoneNumber, address, identity, image, dob, teacherPositions, degrees } = req.body;

            const teacher = await teacherModel.findById(id);
            if (!teacher) {
                return res.status(404).json({ message: "Không tìm thấy giáo viên." });
            }

            if (teacher.userId) {
                await userModel.findByIdAndUpdate(teacher.userId, {
                    name,
                    email,
                    phoneNumber,
                    address,
                    identity,
                    dob
                });
            }

            const firstDegree = degrees?.[0] || {};
            teacher.image = image || teacher.image; 
            teacher.teacherPositions = teacherPositions || teacher.teacherPositions;
            teacher.degrees = [
                {
                    type: firstDegree.type,
                    school: firstDegree.school,
                    major: firstDegree.major,
                    year: firstDegree.year,
                    isGraduated: firstDegree.isGraduated
                }
            ];

            await teacher.save();

            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin giáo viên thành công!",
                data: teacher
            });

        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi chỉnh sửa", error: error.message });
        }
    },

    deleteTeacher: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedTeacher = await teacherModel.findByIdAndUpdate(
                id, 
                { isDelete: true }, 
                { new: true }
            );

            if (!deletedTeacher) {
                return res.status(404).json({ message: "Không tìm thấy giáo viên để xóa." });
            }

            res.status(200).json({
                success: true,
                message: "Xóa giáo viên thành công (Xóa mềm)."
            });

        } catch (error) {
            res.status(500).json({ message: "Lỗi server khi xóa", error: error.message });
        }
    }
};

export default teacherController;