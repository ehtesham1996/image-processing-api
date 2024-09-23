import sharp from 'sharp';

export const createThumbnail = async (
  imageBuffer: Buffer,
  size: number
): Promise<Buffer> => {
  return sharp(imageBuffer).resize({ width: size }).toBuffer();
};
