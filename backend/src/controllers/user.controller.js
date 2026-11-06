const User = require("../models/User")
const Task = require("../models/Task")

async function getAllUsers(req,res) {
    try{
        const users = await User.find()

        res.status(200).json({
            message:"All Users Data",
            Users:users
        })
    }
    catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

async function getUserById(req,res) {
    try{
        const U_id = req.user.U_id

        const user = await User.findOne({U_id:U_id})
        if(!user){
            return res.status(404).json({
                message:"User not Found"
            })
        }

        res.status(200).json({
            message:"User Data",
            User:user
        })
    }
    catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

async function updateUserById(req,res){
    try{
        const {U_name,Email,Phone,} = req.body

        const U_id = req.user.U_id;

        const user = await User.findOne({U_id : U_id})
        if(!user){
            return res.status(404).json({
                message:"User not Found"
            })
        }


        user.U_name = U_name ?? user.U_name;
        user.Email = Email ?? user.Email;
        user.Phone = Phone ?? user.Phone;

        await user.save()

        res.status(200).json({
            message:"User Updated successfully",
            User:{U_id :user.U_id,
                U_name:user.U_name,
                Email:user.Email,
                Phone:user.Phone,
                CreatedAt:user.CreatedAt
            }
        })

    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
} 

async function deleteUserByID(req,res) {

    try{
        const U_id = req.user.U_id

    const user = await User.findOne({U_id:U_id})

    if(!user){
        return res.status(404).json({
            message:"User is not found"
        })
    }

    const userDeleted = await user.deleteOne()
    
    if(userDeleted.deletedCount > 0){
    await Task.deleteMany({Created_by:U_id})
    }

    res.clearCookie("token")
    res.status(200).json({
        message:"User Deleted successfully",
        User:user
    })
    
    }
    catch(error){
        res.status(400).json({
            message:error.message
        })
    }

    
}

module.exports = {getAllUsers,getUserById,updateUserById,deleteUserByID}


