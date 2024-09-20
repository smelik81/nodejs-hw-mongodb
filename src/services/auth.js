import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';

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
