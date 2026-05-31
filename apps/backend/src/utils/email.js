import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendCustomerSurvey(surveyForm) {
  try {
    const responseHtml = Object.entries(surveyForm)
      .filter(([key]) => !["fullName", "email", "phone", "contactPermission"].includes(key))
      .map(([key, value]) => {
        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
        return `<p><strong>${label}:</strong> ${value || "N/A"}</p>`;
      })
      .join("");

    await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: surveyForm?.email,
      subject: "New Customer Survey Response",
      html: `
        <h2>New Survey Submission</h2>

        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${surveyForm?.fullName || "N/A"}</p>
        <p><strong>Email:</strong> ${surveyForm?.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${surveyForm?.phone || "N/A"}</p>
        <p><strong>Wants Contact:</strong> ${surveyForm?.contactPermission === "yes" ? "Yes" : "No"}</p>

        <hr />

        <h3>Survey Responses</h3>
        ${responseHtml}
      `
    });

  } catch (e) {
    console.error("EMAIL ERROR:", e);
    throw e;
  }
}


export async function sendUserFeedbackEmail(contactForm) {
  try {
    await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: contactForm?.email,
      subject: "New Customer Feedback",
      html: `
        <h2>Customer Feedback</h2>

        <p><strong>Name:</strong> ${contactForm?.username || "N/A"}</p>
        <p><strong>Email:</strong> ${contactForm?.email || "N/A"}</p>

        <hr />

        <h3>Message</h3>
        <p>${contactForm?.message || "No message provided."}</p>
      `
    });
  } catch (e) {
    console.error("EMAIL ERROR:", e);
    throw e;
  }
}

export async function sendPasswordResetEmail(to, token) {
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
      const optionLines = [];


      if (item.options?.size) {
        optionLines.push(
          `<li><strong>Size:</strong> ${item.options.size.label}</li>`
        );
      }


      if (item.options?.syrup) {
        optionLines.push(
          `<li><strong>Syrup:</strong> ${item.options.syrup.label}</li>`
        );
      }

      if (Array.isArray(item.options?.extras) && item.options.extras.length > 0) {
        const extrasList = item.options.extras
          .map(extra => extra.label)
          .join(", ");
        optionLines.push(
          `<li><strong>Extras:</strong> ${extrasList}</li>`
        );
      }

      const optionsHtml = optionLines.length
        ? `<ul style="margin: 0; padding-left: 18px;">${optionLines.join("")}</ul>`
        : `<p style="margin: 0; color: #777;">No customisations</p>`;

      return `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
          <p style="margin: 0; font-size: 16px;">
            <strong>${item.name}</strong> (x${item.quantity})
          </p>
          <p style="margin: 4px 0 0;">£${(item.price ?? item.basePrice ?? 0).toFixed(2)}</p>
          ${optionsHtml}
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
          <p>We will notify you as soon as your order is <strong>${order.customer.deliveryOption === "delivery"
          ? "out for delivery"
          : "ready for collection"
        }</strong>.</p>
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
