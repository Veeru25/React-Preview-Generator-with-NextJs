// const { default: mongoose } = require("mongoose");
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique: true,
        }, 
        password:{
            type:String,
            required: true
        },
        role:{
            type:String,
            enum:['user', 'admin'],
            default:'user'
        },
        messages: [
            {
              role: { type: String, enum: ["user", "model"], required: true },
              parts: [
                {
                  text: { type: String, required: true },
                },
              ],
            },
          ],
          createdAt: { type: Date, default: Date.now },
})

const UserModel = mongoose?.models?.user || mongoose.model('user', userSchema)

export default UserModel