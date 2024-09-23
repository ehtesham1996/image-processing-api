import { startPolling } from '@services/sqs.service';
import { SQS_QUEUE_URL, SQS_POLLING_INTERVAL } from '@config/env';

const queueUrl = SQS_QUEUE_URL;
const pollingInterval = SQS_POLLING_INTERVAL;

export const startSqsPolling = () => {
  console.info('Starting SQS polling...');
  startPolling(queueUrl, pollingInterval);
};
