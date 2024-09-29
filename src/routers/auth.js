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

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  controllerWrapper(authControllers.signupController),
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
