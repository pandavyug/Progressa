const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        U_id: {
            type: Number,
            required: true,
            unique: true,   
        },
        U_name: {
            type: String,
            required: true,
            trim: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        Phone:{
            type: Number,
            required: true,
            trim: true,
        },
        Password: {
            type: String,
            required: true,
        },
        CreatedAt: {
            type: String,
            required: true,
        }
    }
)

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;