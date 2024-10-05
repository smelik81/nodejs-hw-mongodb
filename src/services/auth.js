import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';

import UserCollection from '../db/models/User.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constans/users.js';
import SessionCollection from '../db/models/Session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { createJwtToken } from '../utils/jwt.js';
import { env } from '../utils/env.js';
import { TEMPLATES_DIR } from '../constans/index.js';
import { validateCode } from '../utils/googleOAuth.js';
/* import { SMTP } from '../constans/index.js'; */

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const signup = async (payload) => {
  const { email, password } = payload;
  const userEmail = await UserCollection.findOne({ email });

  if (userEmail) {
    throw createHttpError(409, 'Email in use');
  }

  const hashUserPassword = await bcrypt.hash(password, 10);

  /*  const data = await UserCollection.create(payload);
  delete data._doc.password;
  return data._doc; */

  const user = await UserCollection.create({
    ...payload,
    password: hashUserPassword,
  });

  return user;
};

export const signin = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const signinOrSignupWithGogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  let user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    const hashPassword = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      email: payload.email,
      username: payload.name,
      password: hashPassword,
      verify: true,
    });
    delete user._doc.password;
  }

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const refresh = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(oldSession.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession._id,
    ...sessionData,
  });

  return userSession;
};

export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const findUser = (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetPasswordTemplatesPath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const resetPasswordTemplatesSource = await fs.readFile(
    resetPasswordTemplatesPath,
    'utf-8',
  );

  const resetToken = createJwtToken({ sub: user._id, email: user.email });

  const template = handlebars.compile(resetPasswordTemplatesSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMEIN')}/reset-password?token=${resetToken}`,
  });

  const optionsEmail = {
    to: email,
    subject: 'Reset your password',
    html,
  };

  try {
    await sendEmail(optionsEmail);
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));

    const user = await UserCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await UserCollection.findOneAndUpdate(
      { _id: user.id },
      { password: encryptedPassword },
    );
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw error;
  }
};
