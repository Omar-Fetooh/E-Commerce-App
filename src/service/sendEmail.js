import { createTransport } from "nodemailer";


export const sendEmail = async (to, subject, html, attachments = []) => {

    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.password,
        },
    });

    const info = await transporter.sendMail({
        from: `"to7a👻" <${process.env.emailSender}>`, // sender address
        to: to ? to : "", // list of receivers
        subject: subject ? subject : "Hello ✔", // Subject line
        html: html ? html : "<b>Hello world?</b>", // html body
        attachments
    });

    if (info.accepted.length) return true
    return false
}

