const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, resetUrl) => {
  if (!process.env.SMTP_HOST) {
    console.log(`Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Reset your MobiShop password',
    text: `Reset your password within 15 minutes: ${resetUrl}`,
    html: `<p>Reset your MobiShop password within 15 minutes:</p><p><a href="${resetUrl}">Reset password</a></p>`,
  });
};

module.exports = { sendPasswordResetEmail };