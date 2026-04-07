import stripe from "stripe";
import Order from "./order.model.js";
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);


export default async function stripeWebhookController(req, res) {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_KEY;
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, signature, secret);
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { status: "paid" });
            console.log(`Order ${orderId} updated to PAID via Webhook.`);
        }
    }

    res.status(200).json({ received: true });
}