import { imageBucket } from '@config/env';
import { Image } from '@src/database/entities/image.model';
import { Request, Response } from 'express';
import { uploadToS3 } from '@services/s3.service';
import { BadRequestError } from '@utils/errors.utils';
import { AppDataSource } from '@database/connection';
import { IMAGE_FOLDER_NAME } from '@config/constant';
import { randomUUID } from 'crypto';

export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) throw new BadRequestError('File is Required');

  const fileExtension = file.originalname?.split('.')?.[1] || 'jpg';
  const filename = `${Date.now()}-${randomUUID()}.${fileExtension}`;

  const { s3Url, key } = await uploadToS3(
    imageBucket,
    IMAGE_FOLDER_NAME,
    filename,
    file
  );

  const imageRepository = AppDataSource.getRepository(Image);
  const newImage = imageRepository.create({ s3Url, key });
  await imageRepository.save(newImage);

  return res.status(201).json(newImage);
};
