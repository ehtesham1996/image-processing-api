import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV as string;
export const AWS_REGION = process.env.AWS_REGION as string;
export const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL as string;
export const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID as string;
export const SES_EMAIL_SOURCE = process.env.SES_EMAIL_SOURCE as string;
export const SQS_POLLING_INTERVAL =
  Number(process.env.SQS_POLLING_INTERVAL) || 5000;
export const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;
export const IMAGE_NOTIFICATION_RECIPIENTS =
  process.env.IMAGE_NOTIFICATION_RECIPIENTS?.split(',') || [];
