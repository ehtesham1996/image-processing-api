import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { AWS_REGION } from '@config/env';
import { processImageHandler } from '@handlers/process-image.handler';
import { asyncProcessErrorHandler } from '@middlewares/error-handler.middleware';

const sqsClient = new SQSClient({ region: AWS_REGION });

export const receiveMessages = (queueUrl: string) => async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 5,
    WaitTimeSeconds: 20,
  });

  const response = await sqsClient.send(command);

  return response.Messages || [];
};

export const deleteMessage =
  (queueUrl: string) => async (receiptHandle: string) => {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });

    await sqsClient.send(command);
  };

export const processMessages =
  (processFn: Function, deleteFn: Function) => async (messages: any[]) => {
    for (const message of messages) {
      try {
        console.log('message', message);
        const event = JSON.parse(message.Body!);

        if (!event.Records?.length) {
          await deleteFn(message.ReceiptHandle);
          return;
        }

        const { bucket, object } = event?.Records?.[0].s3;
        await processFn(bucket.name, object.key);
        await deleteFn(message.ReceiptHandle);
      } catch (error) {
        console.error('Error processing SQS message', error);
        throw error;
      }
    }
  };

export const startPolling = (queueUrl: string, interval: number) => {
  const poll = async () => {
    console.info('Polling for messages...');
    const messages = await receiveMessages(queueUrl)();

    if (messages.length === 0) {
      console.info('No messages in queue');
      return;
    }

    await processMessages(
      processImageHandler,
      deleteMessage(queueUrl)
    )(messages);
  };

  setInterval(async () => {
    try {
      await poll();
    } catch (error) {
      console.error('Polling error', error);
      asyncProcessErrorHandler(error);
    }
  }, interval);
};
