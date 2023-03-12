require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            // service: process.env.SERVICE,
            // port: process.env.PORT,
            // secure: true,
            // auth: {
            //     user: process.env.USER,
            //     pass: process.env.PASS,
            // },
            host: "smtp.gmail.com",
            service: "Gmail",
            port: 587,
            secure: false,
            auth: {
                user: "binayshaw7777@gmail.com",
                pass: "oxinaqhigkpawdac",
            },
        });
        await transporter.sendMail({
            from: "binayshaw7777@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;