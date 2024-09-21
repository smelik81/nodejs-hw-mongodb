import { Router } from 'express';

import controllerWrapper from '../utils/controllerWraper.js';
import validateBody from '../utils/validateBody.js';
import { userSigninSchema, userSignupSchema } from '../validation/users.js';
import { signinController, signupController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(userSignupSchema),
  controllerWrapper(signupController),
);

authRouter.post(
  '/signin',
  validateBody(userSigninSchema),
  controllerWrapper(signinController),
);

export default authRouter;
