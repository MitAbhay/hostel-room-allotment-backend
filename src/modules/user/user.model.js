import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            default: null 
        },
        address: {
            type: String,
            default: null 
        },
        phoneNumber: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        registrationNumber: {
            type: String,
            default: null
        },
        roomNumber: {
            type: Number,
            default: null
        },
        hasRoom: {
            type: Boolean,
            default: false,
        },
        block: {
            type: String,
            default: null
        },
        feeReceipt: {
            type: String,
            default: null
        },
        feeAmount: {
            type: Number,
            default: null 
        },
        feeSbiRef: {
            type: String,
            default: null 
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        gender: {
            type: String,
            enum: ['male', 'female']
        },
        role: {
            type: String,
            enum: ['admin', 'student']
        },
        status: {
            type: String,
            enum: ["penging", "declined", "verified", null],
            default: null
        },
        remarks: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
