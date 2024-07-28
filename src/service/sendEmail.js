import { createTransport } from "nodemailer";


export const sendEmail = async (to, subject, html) => {

    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: "omarfetooh62@gmail.com",
            pass: "qpgqgdmlswgjijia",
        },
    });

    const info = await transporter.sendMail({
        from: '"to7a👻" <omarfetooh62@gmail.com>', // sender address
        to: to ? to : "", // list of receivers
        subject: subject ? subject : "Hello ✔", // Subject line
        html: html ? html : "<b>Hello world?</b>", // html body
    });

    if (info.accepted.length) return true
    return false
}

