import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SEND_GRID_KEY);

const EmployeeRegisterationEmail = async (object) => {
  try {
    const msg = {
      to: object.email,
      from: process.env.EMAIL,
      subject: 'Welcome to the Employee Tracking App',
      html: `<p>${object.message}</p> Credentials: email:  ${object.email}  and Password: ${object.password}`,
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    return false;
  }
};

export default EmployeeRegisterationEmail;
