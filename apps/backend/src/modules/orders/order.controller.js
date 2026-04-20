import * as orderService from "./order.service.js";


export async function createOrder(req, res) {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, order });
}

export async function getAllOrders(req, res) {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, count: orders.length, orders });
}


export async function getOrderById(req, res) {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, order });
}


export async function getMyOrders(req, res) {

    const orders = await orderService.getOrdersByUserId(req.user.userId);
    res.status(200).json({ success: true, count: orders.length, orders });
}


export async function updateOrder(req, res) {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json({ success: true, order });
}
export async function markOrderAsPaid(req, res) {
    const order = await orderService.markOrderAsPaid(req.params.id);
    res.status(200).json({ success: true, order});
}

export async function deleteOrder(req, res) {
    await orderService.deleteOrder(req.params.id);
    res.status(204).json({ success: true, data: null });
}