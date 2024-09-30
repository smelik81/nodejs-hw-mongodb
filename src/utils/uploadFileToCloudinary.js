import cloudinary from 'cloudinary';
import * as fs from 'node:fs/promises';

import { env } from './env.js';
import createHttpError from 'http-errors';

cloudinary.v2.config({
  secure: true,
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_KEY_SECRET'),
});

const saveFileToCloudinary = async (file, folder) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file.path, {
      folder,
    });
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Error saving file to upload directory:', error);
    throw createHttpError(
      500,
      'Failed to save the file, please try again later.',
    );
  }
};

export default saveFileToCloudinary;
