require('dotenv').config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME;

async function sendUserEmail(body, pin) {
  const { email, name, mobile } = body || {};

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    console.error("sendUserEmail: invalid or missing recipient email:", email);
    return { success: false, error: "Invalid or missing recipient email" };
  }

  const subject = "Account Creation Notification - My Package";
  const htmlContent = `
    <p>Dear ${name || "User"},</p>
    <p>An account has been created for you in the My Package to
enable secure access to authorized resources and services.</p>
<p>To get started, please activate your account by using given
credentials.</p>
    <h5>Account Details:
    <br>Username - ${email}
    <br>Password - ${pin}</h5>
    
    <p>Regards,<br/>My Package</p>
  `;

  const msg = {
    to: email, // change to real recipient
    from: { email: SENDER_EMAIL, name: SENDER_NAME }, // MUST be verified in SendGrid
    subject,
    text: `Your account has been created. Username: ${email}, Password: ${pin}`,
    html: htmlContent,
  };

  try {
    console.log(`Sending email to: ${email}`);
    const response = await sgMail.send(msg);
    console.log("Email sent! Status code:", response[0].statusCode);
    return { success: true, response: response[0].statusCode };
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error);
    return { success: false, error: error.response?.body || error };
  }
}

module.exports = { sendUserEmail };

