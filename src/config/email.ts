import formData from 'form-data';
import Mailgun from 'mailgun.js';
const crypto = require('crypto');


const apiKey =  process.env.MAILGUN_API_KEY as string;
const domain = process.env.MAILGUN_DOMAIN as string;


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: apiKey
});


export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      html,
    };
  
    await mg.messages.create(domain, data);
  }
  catch (error) {
    throw new Error(`Error sending email: ${error}`);
  }
}

export const generateEmailToken = (length:number) => {
  return crypto.randomBytes(length).toString('hex');
}
