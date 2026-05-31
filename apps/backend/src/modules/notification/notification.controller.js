import * as notificationServices from "./notification.service.js"

export async function getUsersNotifications(req, res) {
    const notifications = await notificationServices.getUserNotifications(req.user.userId);
    res.status(200).json(notifications);
}
export async function viewNotification(req, res) {
    const notification = await notificationServices.viewNotification(req.user.userId, req.params.id);
    res.status(200).json(notification);
}
export async function deleteNotification(req, res) {
    const notification = await notificationServices.deleteNotification(req.user.userId, req.params.id)
    res.sendStatus(204);
}