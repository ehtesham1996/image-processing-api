import { downloadFile, uploadToS3 } from '@services/s3.service';
import { createThumbnail } from '@utils/image-tools.utils';
import { sendEmailNotification } from '@services/ses.service';
import {
  S3Error,
  ThumbnailCreationError,
  EmailError,
} from '@utils/errors.utils';
import { IMAGE_FOLDER_NAME } from '@config/constant';
import { IMAGE_NOTIFICATION_RECIPIENTS } from '@config/env';

export const processImageHandler = async (bucket: string, key: string) => {
  const imageBuffer = await downloadFile(bucket, key).catch((error) => {
    throw new S3Error(`Failed to download image ${key} from bucket ${bucket}`);
  });

  /**
   * Here we can do image processing. E.G send to AI service for processing for analysis
   * or simply create a thumbnail
   */
  const size = 200;
  const thumbnailBuffer = await createThumbnail(imageBuffer, 200).catch(() => {
    throw new ThumbnailCreationError(
      `Failed to create thumbnail for image ${key}`
    );
  });

  const fileName = key.split('/')[1];
  const thumbnailKey = `${size}x${size}/${fileName}`;
  await uploadToS3(bucket, thumbnailKey, thumbnailBuffer).catch(() => {
    throw new S3Error(
      `Failed to upload thumbnail ${thumbnailKey} to bucket ${bucket}`
    );
  });

  const message = `A new image has been uploaded to the bucket ${bucket} with the key ${key}`;
  const subject = 'New Image Uploaded';
  const recipients = IMAGE_NOTIFICATION_RECIPIENTS;
  await sendEmailNotification(message, subject, recipients).catch((error) => {
    console.error(error);
    throw new EmailError(
      `Failed to send email notification for thumbnail ${thumbnailKey}`
    );
  });
};
