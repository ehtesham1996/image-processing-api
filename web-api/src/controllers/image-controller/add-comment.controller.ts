import { Image } from '@src/database/entities/image.model';
import { Request, Response } from 'express';
import { AppDataSource } from '@database/connection';
import { ImageComments } from '@models/image-comment.model';
import { BadRequestError } from '@utils/errors.utils';

export const addComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body || {};

  if (!comment) throw new BadRequestError('Comment is Required');

  const imageRepository = AppDataSource.getRepository(Image);
  const commentsRepository = AppDataSource.getRepository(ImageComments);

  const image = await imageRepository.findOneBy({ id });

  if (!image) {
    throw new BadRequestError('Image not found');
  }

  const newComment = commentsRepository.create({ text: comment, image });
  await commentsRepository.save(newComment);

  return res.status(200).json(newComment);
};
