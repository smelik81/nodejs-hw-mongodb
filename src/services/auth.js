import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import { randomBytes } from 'crypto';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constans/users.js';
import SessionCollection from '../db/models/Session.js';

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
  console.log(user);

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
