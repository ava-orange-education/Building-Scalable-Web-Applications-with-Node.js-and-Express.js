// This class will contain utility functions to send a notification to a user.
// The notifications can be sent via email, SMS, or push notification.

// Path: src/utils/notification_util.ts

import * as nodemailer from 'nodemailer';
import Queue from 'bull';

export class NotificationUtil {

    // nodemailer transporter instance
    private static transporter;
    private static from: string;

    // Redis Queue for email tasks
    private static emailQueue = new Queue('emailQueue', 'redis://127.0.0.1:6379');

    constructor(config) {
        if (!config) {
            throw new Error('Config not provided');
        }

        if (!NotificationUtil.transporter) {
            NotificationUtil.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email_config.user,
                    pass: config.email_config.password
                }
            });
        }

        NotificationUtil.from = config.email_config.from;
    }

    // Send an email to the user
    public static async sendEmail(to: string, subject: string, body: string) {
        try {
            const mailOptions = {
                to: to,
                subject: subject,
                html: body
            };

            const status = await NotificationUtil.transporter.sendMail(mailOptions);
            if (status?.messageId) {
                return status.messageId;
            } else {
                return false;
            }
        } catch (error) {
            console.log(`Error while sendEmail => ${error.message}`);
            return false;
        }
    }

    // Function to enqueue email tasks
    public static async enqueueEmail(to: string, subject: string, body: string) {
        console.log('Enqueuing email task');
        console.log(`to: ${to}`);
        console.log(`subject: ${subject}`);
        console.log(`body: ${body}`);
        
        // Enqueue the email task
        await NotificationUtil.emailQueue.add({
            from: NotificationUtil.from,
            to,
            subject,
            body
        });
        return true;
    }

}
