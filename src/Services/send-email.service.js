import nodemailer from "nodemailer";

export const sendEmailService = async ({
  to = "",
  subject = "",
  textMessage = "",
  htmlMessage = "",
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "omarfetooh62@gmail.com",
      pass: process.env.SEND_MAIL_PASSKEY,
    },
  });

  const info = await transporter.sendMail({
    from: "<No-Reply> <omarfetooh62@gmail.com>", // sender address
    to, // list of receivers
    subject, // Subject line
    text: textMessage, // plain text body
    html: htmlMessage,
    attachments,
  });

  return info;
};
