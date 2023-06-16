import dotenv from 'dotenv';
dotenv.config();

export const url: string = process.env.MONGODB_URI!;
