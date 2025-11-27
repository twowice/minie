import nodemailer from "nodemailer";

export async function sendMail(to: any, subject: string, html: string,  attachments: any[] = []) {
    const transport = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return transport.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        attachments
    })
}