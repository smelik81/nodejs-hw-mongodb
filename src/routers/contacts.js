import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import controllerWrapper from '../utils/controllerWraper.js';

const contactRouter = Router();

contactRouter.get(
  '/',
  controllerWrapper(contactsController.getAllContactsController),
);
contactRouter.get(
  '/:contactId',
  controllerWrapper(contactsController.getContactByIdController),
);
contactRouter.post(
  '/',
  controllerWrapper(contactsController.addContactController),
);
contactRouter.put(
  '/:contactId',
  controllerWrapper(contactsController.upsertContactController),
);
contactRouter.patch(
  '/:contactId',
  controllerWrapper(contactsController.patchContactController),
);
contactRouter.delete(
  '/:contactId',
  controllerWrapper(contactsController.deleteContactController),
);

export default contactRouter;
