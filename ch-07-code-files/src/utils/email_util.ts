import * as nodemailer from 'nodemailer';
import * as config from '../../server_config.json';

export const sendMail = async (to: string, subject: string, body: string) => {
    try {
        // Create a Nodemailer transporter using your Gmail credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email_config.user, // Replace with your Gmail email
                pass: config.email_config.password, // Replace with your app-specific password
            },
        });
        // Define email options
        const mailOptions = {
            from: config.email_config.from,
            to: to,
            subject: subject,
            html: body,
        };

        // Send the email
        const status = await transporter.sendMail(mailOptions);
        if (status?.messageId) {
            return status.messageId;
        } else {
            return false;
        }
    } catch (error) {
        console.log(`Error while sendEmail => ${error.message}`);
        return false;
    }
};
