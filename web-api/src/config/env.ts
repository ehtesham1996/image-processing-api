import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const PG_HOST = process.env.PG_HOST as string;
export const PG_PORT = process.env.PG_PORT as string;
export const DB_NAME = process.env.DB_NAME as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const AWS_REGION = process.env.AWS_REGION as string;
export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const imageBucket = process.env.IMAGE_BUCKET as string;
