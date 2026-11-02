const { Resend } = require('resend');

const sendPasswordResetEmail = async (email, resetUrl) => {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    console.error('[Email] Password reset email not sent: RESEND_API_KEY and EMAIL_FROM are required');
    throw new Error('Password reset email service is not configured');
  }

  const resend = new Resend(RESEND_API_KEY);
  let result;

  try {
    result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset your MobiShop password',
      text: `Reset your password within 15 minutes: ${resetUrl}`,
      html: `<p>Reset your MobiShop password within 15 minutes:</p><p><a href="${resetUrl}">Reset password</a></p>`,
    });
  } catch (error) {
    const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : undefined;
    console.error('[Email] Password reset email request failed', { statusCode });
    throw new Error('Password reset email delivery failed');
  }

  if (!result || result.error || !result.data) {
    const statusCode = Number.isInteger(result?.error?.statusCode)
      ? result.error.statusCode
      : undefined;
    console.error('[Email] Password reset email delivery rejected', { statusCode });
    throw new Error('Password reset email delivery failed');
  }

  return result.data;
};

module.exports = { sendPasswordResetEmail };
