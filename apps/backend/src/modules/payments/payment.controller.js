import * as paymentService from "./payment.service.js"

export async function createPaymentIntent(req, res) {
    const { items, amount } = req.body
    const secret = await paymentService.createPaymentIntent(items, amount)
    res.status(200).json(secret);
}

export async function updatePaymentIntent(req, res) {
    const { orderId, paymentId } = req.body
    await paymentService.updatePaymentIntent(orderId, paymentId);
    res.status(200).json({
        success: true,
        message: "Payment intent updated with metadata"
    });
}