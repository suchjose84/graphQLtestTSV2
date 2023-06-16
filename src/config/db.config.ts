// const dotenv = require('dotenv');
// dotenv.config();

// module.exports = {
//   url: process.env.MONGODB_URI,
// };

import dotenv from 'dotenv';
dotenv.config();

export const url: string = process.env.MONGODB_URI!;
