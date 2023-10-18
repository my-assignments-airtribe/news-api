import Mailgun from "mailgun-js";
const crypto = require('crypto');

const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const data = {
    from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    html,
  };

  await mailgun.messages().send(data);
}

export const generateEmailToken = (length:number) => {
  return crypto.randomBytes(length).toString('hex');
}
