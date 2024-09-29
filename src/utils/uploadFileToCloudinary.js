import cloudinary from 'cloudinary';
import * as fs from 'node:fs/promises';

import { env } from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY_CLOUD_NAME),
  api_key: env(CLOUDINARY_API_KEY),
  api_secret: env(CLOUDINARY_KEY_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(filePath);
  console.log(response);
};
