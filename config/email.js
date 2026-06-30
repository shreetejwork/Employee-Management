import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export const sendEmailWithAttachment = async ({ to, subject, html, attachments }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"HR & Payroll System" <noreply@winrendersystems.com>',
    to,
    subject,
    html,
    attachments,
  };

  // If no credentials configured, log and return success mock
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_email')) {
    console.log('--- EMAIL SEND SIMULATION ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html.replace(/<[^>]*>/g, '').trim().substring(0, 100)}...`);
    console.log(`Attachments: ${attachments?.map(a => a.filename).join(', ') || 'None'}`);
    console.log('------------------------------');
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
};

export default transporter;
