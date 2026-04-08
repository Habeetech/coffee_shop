import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendPasswordResetEmail(to, token) {

  //const resetUrl = `http://localhost:3000/api/auth/reset-password/${token}`;
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err;
  }
}
export async function sendOrderPaymentConfirmation(to, order) {
  try {
    const itemsHtml = order.items.map(item => {
      const optionsHtml = item.options && Object.keys(item.options).length > 0
        ? Object.values(item.options).map(opt => 
            `<li>${opt.label}: +£${opt.priceModifier.toFixed(2)}</li>`
          ).join("")
        : "None";

      return `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
          <p><strong>Product:</strong> ${item.name} (x${item.quantity})</p>
          <p><strong>Price:</strong> £${item.price.toFixed(2)}</p>
          <p><strong>Extras:</strong></p>
          <ul>${optionsHtml}</ul>
        </div>
      `;
    }).join("");

    await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1>Payment Received! ☕</h1>
          <p>Thank you for your order, ${order.customer.firstName}. We've received your payment and our baristas are getting started!</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          </div>

          <h3>Items:</h3>
          ${itemsHtml}

          <h2 style="text-align: right;">Total: £${order.total.toFixed(2)}</h2>
          
          <hr />
          <p>We will notify you as soon as your order is <strong>${order.customer.deliveryOption === 'delivery' ? 'out for delivery' : 'ready for collection'}</strong>.</p>
          <p>Thank you for choosing Coffee Shop!</p>
        </div>
      `
    });
    console.log("Confirmation email sent to:", to);
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err;
  }
}