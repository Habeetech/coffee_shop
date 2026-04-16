import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User Id is required"],
        ref: "User",
        trim: true
    },
    token: {
        type: String,
        required: [true, "Token is required"],
        trim: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})
refreshTokenSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 })
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;