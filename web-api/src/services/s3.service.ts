import { AWS_REGION } from '@config/env';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: AWS_REGION,
});

export const uploadToS3 = async (
  bucketName: string,
  folderName: string,
  fileName: string,
  file: Express.Multer.File
): Promise<{
  s3Url: string;
  key: string;
}> => {
  const key = `${folderName}/${fileName}`;
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return {
    s3Url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${key}`,
    key,
  };
};
