import stripe from "stripe";
import Order from "./order.model.js";
import { sendOrderPaymentConfirmation } from "../../utils/email.js";
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);


export default async function stripeWebhookController(req, res) {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_KEY;
    let event;


    try {
        event = stripeInstance.webhooks.constructEvent(req.body, signature, secret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;


        let orderId = paymentIntent.metadata?.orderId;
        console.log("Order id in metadata", orderId);

        if (!orderId) {
            const order = await Order.findOne({ stripeId: paymentIntent.id });
            orderId = order?._id;
            console.log("OrderId in DB", orderId);
        }

        if (orderId) {
            console.log("Got orderId, updating status");
            const paidOrder = await Order.findOneAndUpdate(
                {
                    _id: orderId,
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

            if (paidOrder) {
                try {
                    await sendOrderPaymentConfirmation(paidOrder.customer.email, paidOrder);
                } catch (emailErr) {
                    console.error("📧 Email failed to send, but payment was recorded:", emailErr.message);
                }
            }
        } else {
            console.error("❌ Critical: Could not link this payment to any order in DB.");
        }
    }

    res.status(200).json({ received: true });
}