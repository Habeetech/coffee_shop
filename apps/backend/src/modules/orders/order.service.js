import Order from "./order.model.js";
import AppError from "../../utils/AppError.js";

export async function createOrder(orderData) {
      const newOrder = await Order.create(orderData);
    if (!newOrder) {
        throw new AppError("Unable to create order", 400);
    }
    return newOrder;
}
export async function getAllOrders() {
  
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
}
export async function getOrderById(id) {
    const order = await Order.findById(id);

    if (!order) {
        throw new AppError(`Order with ID ${id} not found`, 404);
    }

    return order;
}
export async function deleteOrder(id) {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
        throw new AppError(`Could not find order ${id} to delete`, 404);
    }

    return deletedOrder;
}
export async function updateOrder(id, updateData) {
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
       returnDocument: "after",
        runValidators: true
    });

    if (!updatedOrder) {
        throw new AppError("Order not found", 404);
    }

    return updatedOrder;
}

export async function getOrdersByUserId(userId) {
    return await Order.find({ userId: userId }).sort({ createdAt: -1 });

}