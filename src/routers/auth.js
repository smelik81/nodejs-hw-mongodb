import { Router } from 'express';

import controllerWrapper from '../utils/controllerWraper.js';
import validateBody from '../utils/validateBody.js';
import { userSignupSchema } from '../validation/users.js';
import { signupController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(userSignupSchema),
  controllerWrapper(signupController),
);

export default authRouter;
