import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "You must provide a username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "You must provide an email"],
        trim: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user"
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date,
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
    },
    address: {
        type: {
            street: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            country: {
                type: String
            },
            postal: {
                type: String
            }
        },
    },
    favorites: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Product"}
    ],
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    defaultStore: { type: mongoose.Schema.Types.ObjectId, 
        ref: "Store", 
    }
},{ timestamps: true})
const User = mongoose.model("User", userSchema)
export default User;