import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
} from '../controllers/contacts.js';
import controllerWrapper from '../utils/controllerWraper.js';

const contactRouter = Router();

contactRouter.get('/', controllerWrapper(getAllContactsController));
contactRouter.get('/:contactId', controllerWrapper(getContactByIdController));

export default contactRouter;
