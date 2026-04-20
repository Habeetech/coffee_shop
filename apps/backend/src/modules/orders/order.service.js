import Order from "./order.model.js";
import AppError from "../../utils/AppError.js";

export async function createOrder(orderData) {
    const newOrder = await Order.create({
        ...orderData,
        expiresAt: new Date(Date.now() + (60 * 60 * 1000))
    });
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
export async function markOrderAsPaid(id) {
    const paidOrder = await Order.findOneAndUpdate(
        {
            _id: id,
            status: "pending"
        },
        {
            status: "paid",
            $unset: { expiresAt: "" },
        },
        {
            returnDocument: "after",
            runValidators: true
        });

    if (!paidOrder) {
        throw new AppError("Order not found or already processed", 404);
    }

    return paidOrder;
}
export async function getOrdersByUserId(userId) {
   
    const all = await Order.find({ userId })
        .sort({ createdAt: -1 });
    const recent = await Order.find({
        userId,
        status: "completed"
    })
        .sort({ createdAt: -1 })
        .limit(3)
    const active = await Order.find({
        userId,
        status: { $nin: ["completed", "cancellled"] }
    })
        .sort({ createdAt: -1 })
    const frequent = await Order.aggregate([
        { $match: { userId } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items._id",
                count: { $sum: "$items.quantity" },
                name: { $first: "$items.name" },
                price: { $first: "$items.price" },
                type: {$first: "$items.type"},
                category: {$first: "$items.category"},
                url: { $first: "$items.url" }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);
    return { all, recent, frequent, active }
}