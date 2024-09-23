import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from '@config/env';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { streamToBuffer } from '@utils/stream-to-buffer.utils';

const s3 = new S3Client({ region: AWS_REGION });

export const uploadToS3 = async (
  bucketName: string,
  key: string,
  buffer: Buffer
): Promise<string> => {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};

export const downloadFile = async (
  bucket: string,
  key: string
): Promise<Buffer> => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const { Body } = await s3.send(command);
  const stream = Body as Readable;
  return await streamToBuffer(stream);
};
