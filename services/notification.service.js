import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can switch to SMTP provider
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

export const sendSuspiciousActivityEmail = async (organization, count) => {
  await transporter.sendMail({
    from: `"Audit Logger" <${process.env.ALERT_EMAIL}>`,
    to: organization.email,
    subject: "🚨 Suspicious Activity Detected",
    text: `High number of DELETE events detected for organization: ${organization.name}.
    
Count: ${count} in last minute.
Organization ID: ${organization._id}`,
  });
};
