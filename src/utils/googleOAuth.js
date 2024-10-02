import { OAuth2Client } from 'google-auth-library';
import * as path from 'node:path';
import { readFile } from 'node:fs/promises';
import { env } from './env.js';
import createHttpError from 'http-errors';

const clientId = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = env('GOOGLE_AUTH_CLIENT_SECRET');

const readClientPath = path.resolve('google-oauth.json');
const clientConfig = JSON.parse(await readFile(readClientPath, 'utf-8'));
const redirectUri = clientConfig.web.redirect_uris[0];

const generateOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export const validateCode = async (code) => {
  const response = await generateOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Unautorization');
  }

  const ticket = await generateOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const generateGoogleOAuthUrl = () => {
  const url = generateOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  return url;
};
