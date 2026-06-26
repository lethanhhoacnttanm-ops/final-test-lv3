import userModel from "../model/user.js";
import dayjs from 'dayjs'

export const userController = {
     getUser: async (req, res) => {
        try {
            const dataUser = await userModel.find({});

            if(dataUser.length === 0){
                return res.status(403).json({
                    message: "Không tim thấy bất cứ dữ liệu liên quan đến người dùng !!!"
                })
            }

            res.status(200).json({
                success: true,
                data: dataUser
            });

        } catch (error) {
            console.log("Error from server")
            console.error(message)
            return res.status(500).json({
                message: error.message
            })
        }
     },
     creatUser: async (req, res) => {
         try{
             const { name, email, phoneNumber, address, identity, dob, role } = req.body

             if(!name || !email || !phoneNumber || !address || !identity || !dob || !role) {
                return res.status(403).json({
                    message: "The field is required !!!"
                })
             }

             const isCheckEmail = await userModel.findOne({email});

             if(isCheckEmail){
                return res.status(403).json({
                    message: "This email is valid !!"
                })
             }



             const newUser = await userModel.create({
                name,
                email,
                phoneNumber,
                address,
                identity,
                dob: dayjs(dob).format('YYYY-MM-DD'),
                role

             })

             res.status(201).json({
                success: true,
                message: "Success create a new User",
                data: newUser
             })

         }catch(error){
            console.log("Error from server")
            console.error(message)
            return res.status(500).json({
                message: error.message
            })

         }
     }
}