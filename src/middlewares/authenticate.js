import createHttpError from 'http-errors';

import * as authServices from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header not found'));
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || typeof token !== 'string') {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await authServices.findSessionByAccessToken(token);

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await authServices.findUser({ id: session.userId });
  console.log(user);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};

export default authenticate;
