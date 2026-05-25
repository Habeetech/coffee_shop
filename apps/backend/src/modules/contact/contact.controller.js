import { sendUserFeedbackEmail } from "../../utils/email.js";

export default async function contactSupport(req, res) {
    await sendUserFeedbackEmail(req.body);
    res.status(200).json("Message Recievied. Thanks for your feedback");
}