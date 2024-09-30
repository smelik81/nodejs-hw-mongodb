import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import controllerWrapper from '../utils/controllerWraper.js';
import validateBody from '../utils/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/uploadFiles.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get(
  '/',
  controllerWrapper(contactsController.getAllContactsController),
);
contactRouter.get(
  '/:contactId',
  isValidId,
  controllerWrapper(contactsController.getContactByIdController),
);
contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  controllerWrapper(contactsController.addContactController),
);
contactRouter.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  controllerWrapper(contactsController.upsertContactController),
);
contactRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  controllerWrapper(contactsController.patchContactController),
);
contactRouter.delete(
  '/:contactId',
  isValidId,
  controllerWrapper(contactsController.deleteContactController),
);

export default contactRouter;
