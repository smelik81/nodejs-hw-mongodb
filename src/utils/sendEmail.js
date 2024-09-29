import nodemailer from 'nodemailer';

import { SMTP } from '../constans/index.js';

const transport = nodemailer.createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

export const sendEmail = async (data) => {
  const email = { ...data, from: SMTP.FROM_EMAIL };
  return await transport.sendMail(email);
};
