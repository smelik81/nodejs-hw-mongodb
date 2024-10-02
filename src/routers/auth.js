import { Router } from 'express';

import controllerWrapper from '../utils/controllerWraper.js';
import validateBody from '../utils/validateBody.js';
import {
  requestSendEmailSchema,
  resetPasswordShema,
  userSigninSchema,
  userSignupSchema,
} from '../validation/users.js';
import * as authControllers from '../controllers/auth.js';
import { loginWithGoogleOAuthSchema } from '../validation/contacts.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  controllerWrapper(authControllers.signupController),
);

authRouter.get(
  '/google-auth-url',
  controllerWrapper(authControllers.getGenerateGoogleOAuthUrlController),
);

authRouter.post(
  '/confirm-google',
  validateBody(loginWithGoogleOAuthSchema),
  controllerWrapper(authControllers.loginWithGoogleOAuthController),
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  controllerWrapper(authControllers.signinController),
);

authRouter.post(
  '/refresh',
  controllerWrapper(authControllers.refreshController),
);

authRouter.post(
  '/logout',
  controllerWrapper(authControllers.signoutController),
);

authRouter.post(
  '/send-reset-email',
  validateBody(requestSendEmailSchema),
  controllerWrapper(authControllers.requestSendEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordShema),
  controllerWrapper(authControllers.resetPasswordController),
);

export default authRouter;
