import Queue from 'bull';
import { NotificationUtil } from '../utils/notification_util';
import e from 'express';

export class QueueWorker {

    private static emailQueue = new Queue('emailQueue', 'redis://127.0.0.1:6379');

    private static MAX_ATTEMPTS = 4;

    constructor() {
        console.log('Initializing QueueWorker');
    }

    public beginProcessing() {
        QueueWorker.emailQueue.process(async (job) => {
            try {
                console.log(`Got a job to send email to ${job.data.to} with subject ${job.data.subject}`);
                const { to, subject, body } = job.data;
                const responseEmail = await NotificationUtil.sendEmail(to, subject, body);
                if (!responseEmail) {
                    // handle error
                }
                console.log(`Email sent to ${to}`);
            } catch (error) {
                // handle error
                console.error(`Failed to send email: ${error.message}`);
            }
        });

        QueueWorker.emailQueue.on('failed', async (job, err) => {
            if (job.attemptsMade >= QueueWorker.MAX_ATTEMPTS) {
                // Handle the final failure
                console.error(`Job permanently failed for ${job.data.to}: ${err.message}`);
            } else {
                // Retry the job
                console.log(`Retrying job for ${job.data.to}`);
                await job.retry();
            }
        });
    }

}