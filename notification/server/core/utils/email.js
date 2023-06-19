import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SEND_GRID_KEY);

const sendEmail = async (to, object) => {
  try {
    const token = jwt.sign({ id: object.id }, process.env.JWT, {
      expiresIn: 36000,
    });
    const msg = {
      to,
      from: process.env.EMAIL,
      subject: 'Welcome to the Employee Tracking App',
      html: `<p><b>Hi,</b></p><br/><p>Thank you for registring with us. Please <a href="${process.env.URL}/api/v1/auth/verify/${token}">verify</a> your account to access your account. Note that this link will expire after 1 hours.</p><br/><p><b>Regards,</b></p><p>Tracker Tech</p>`,
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

export default sendEmail;
