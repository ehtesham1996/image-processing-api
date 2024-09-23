import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { AWS_REGION, SES_EMAIL_SOURCE } from '@config/env';

const sesClient = new SESClient({ region: AWS_REGION });

export const sendEmailNotification = async (
  message: string,
  subject: string,
  recipients: string[]
) => {
  const sendEmailCommand = new SendEmailCommand({
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: SES_EMAIL_SOURCE,
  });

  await sesClient.send(sendEmailCommand);
  console.info(`Email sent to: ${recipients.join(', ')}`);
};
