import * as paymentService from "./payment.service.js"

export async function createPaymentIntent(req, res) {
    const {items, amount } = req.body
    const secret = await paymentService.createPaymentIntent(items, amount)
    res.status(200).json(secret);
}