import { sendUserFeedbackEmail } from "../../utils/email.js";
import { sendCustomerSurvey } from "../../utils/email.js";

export  async function contactSupport(req, res) {
    await sendUserFeedbackEmail(req.body);
    res.status(200).json("Message recievied. Thanks for your feedback");
}

export async function surverResponse(req, res) {
    await sendCustomerSurvey(req.body);
    res.status(200).json("Thanks for your response.")
    
}