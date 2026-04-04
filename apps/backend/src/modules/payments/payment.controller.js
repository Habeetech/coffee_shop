import * as paymentService from "./payment.service.js"

export async function createPaymentIntent(req, res) {
    const {items } = req.body
    const secret = await paymentService.createPaymentIntent(items)
    res.status(200).json(secret);
}