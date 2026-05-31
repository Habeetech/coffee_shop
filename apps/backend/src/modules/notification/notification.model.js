import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Recipient id is required"]
    },
    senderName: {
        type: String,
        trim: true,
        required: [true, "Sender name is required"]
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    enablePushNotification: {
        type: Boolean,
        default: false
    },
    payload: {
        eventType: {
            type: String,
            enum: ["order", "system", "promotion"],
            required: [true, "Event type is required"]
        },
        eventTag: {
            type: String,
            enum: ["ORDER RECEIVED", "ORDER READY", "ORDER COMPLETED", "SYSTEM MAINTENANCE", "PROMOTION"],
            required: [true, "Event tag is required"]
        },
        eventVars: {
            type: mongoose.Schema.Types.Mixed,
        }
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true })

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification