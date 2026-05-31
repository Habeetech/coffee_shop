import AppError from "../../utils/AppError.js";
import Notification from "./notification.model.js";
import { createNotificationSchema } from "./notification.schema.js"
import { getIo } from "../../utils/socket.js"

export async function createNotification(notificationObj) {
    const { body } = createNotificationSchema.parse({
        body: notificationObj
    })
  
        const notification = await Notification.create({
        ...body,
        expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
    });
    getIo()
    .to(body.recipientId)
    .emit("NEW_NOTIFICATION", notification);
    return notification;
}

export async function getUserNotifications(userId) {
    if (!userId) {
        throw new AppError(`User with ID ${userId} not found`, 404);
    }
    const notifications = await Notification.find({recipientId: userId})
    .sort({createdAt: -1})
    return notifications;
}
export async function viewNotification(userId, notificationId) {
  
    const notification = await Notification.findOneAndUpdate({
        recipientId: userId,
        _id: notificationId
    }, {
        isRead: true
    }, {returnDocument: "after"});
    if (!notification) {
        throw new AppError(`No notification found for Id - ${notificationId}`, 404);
    }
    return notification;
}
export async function deleteNotification(userId, notificationId) {
   const deletedNotification = await Notification.findOneAndDelete({recipientId: userId, _id: notificationId});
   if(!deletedNotification)
   {
    throw new AppError(`No notification found for Id - ${notificationId}`, 404);
   }
    return deletedNotification;
}