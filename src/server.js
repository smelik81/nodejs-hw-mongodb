import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

import { getAllContacts, getContactById } from './services/contactsServices.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    // const data = await getAllContacts({ contactType: 'home' });
    const data = await getAllContacts({});

    res.json({
      status: 200,
      message: 'Successfully find contacts',
      data,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).send({
        message: `Contact with contactId-${contactId} not found`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully find contact ${contactId}`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} Not found`,
    });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    next();
  });

  const PORT = Number(env('PORT', '3000'));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
