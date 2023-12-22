import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

exports.sendEmail = async (to, text, subject) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      // Định nghĩa nội dung email
        const mailOptions = {
          from: process.env.MAIL_USERNAME,
          to: to,
          subject: subject,
          text: text
        };

      // Gửi email
      const info = await transporter.sendMail(mailOptions);
      return info
}