require('dotenv').config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

async function sendUserSMS(to, message) {
  try {
    if (!/^\+?[1-9]\d{9,14}$/.test(to)) {
      throw new Error("Invalid mobile number format. Must include country code (e.g. +91xxxxxxxxxx).");
    }

    const response = await client.messages.create({
      body: message,
      messagingServiceSid: messagingServiceSid,
      to,
    });

    console.log("SMS sent successfully:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendUserSMS };
