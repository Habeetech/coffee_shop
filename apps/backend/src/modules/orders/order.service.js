import Order from "./order.model.js";
import { updatePaymentIntent } from "../payments/payment.service.js";
import AppError from "../../utils/AppError.js";

export async function createOrder(orderData) {
      const newOrder = await Order.create(orderData);

    if (!newOrder) {
        throw new AppError("Unable to create order", 400);
    }

    if (newOrder.paymentMethod === "stripe") {
     
        await updatePaymentIntent({
            orderId: newOrder._id,
            paymentId: newOrder.stripeId
        });
    }

    return newOrder;
}