import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    try {
        // Create transporter (using Gmail as example)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL ,
                pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
            }
        });

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: to,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

export default sendEmail;