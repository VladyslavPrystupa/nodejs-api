const nodemailer = require('nodemailer');

const { UKR_NET_EMAIL, UKR_NET_PASWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendMail = async data => {
  const { to, subject, html } = data;
  const email = {
    from: UKR_NET_EMAIL,
    to,
    subject,
    html,
  };
  await transport.sendMail(email);
  return true;
};

module.exports = sendMail;
