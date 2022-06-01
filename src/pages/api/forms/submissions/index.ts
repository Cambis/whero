/* eslint-disable import/no-anonymous-default-export */
import { withSentry } from '@sentry/nextjs';
import Cors from 'cors';
import type { Files } from 'formidable';
import type { NextApiResponse, NextApiHandler } from 'next';

import {
  validateSubmissionData,
  submitDataToDato,
  uploadFileToDato,
  runMiddleware,
  authenticateFormSubmission,
  useFormidable,
} from 'lib/api';
import type {
  IFormSubmission,
  DatoSingleAssetField,
  FormidableNextApiRequest,
} from 'lib/api/types';

type Request = IFormSubmission & {
  token: string;
  [key: string]: string | string[] | DatoSingleAssetField;
};

type Response = {
  message?: string;
  errors?: string[];
};

// Disable default next body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: process.env.NEXT_CORS_ALLOWLIST ? process.env.NEXT_CORS_ALLOWLIST.split(', ') : '*',
});

const handler: NextApiHandler<Response> = async (
  req: FormidableNextApiRequest,
  res: NextApiResponse<Response>,
) => {
  await Promise.all([
    runMiddleware<Response>(req, res, cors),
    runMiddleware<Response>(req, res, useFormidable),
  ]);

  try {
    await runMiddleware<Response>(req, res, authenticateFormSubmission);
  } catch (err) {
    res.status(401);
    res.json({ errors: [err.message] });
    return;
  }

  try {
    await runMiddleware<Response>(req, res, validateSubmissionData);
  } catch (err) {
    res.status(401);
    res.json({ errors: [err.message] });
  }

  const fields = { ...req.fields } as Request;
  const files = { ...req.files } as Files;

  // Submit to DatoCMS if production
  if (process.env.NODE_ENV === 'production') {
    try {
      const fileIds = await Promise.all(Object.values(files).map((file) => uploadFileToDato(file)));

      await submitDataToDato<Request>(fields, fileIds);

      res.status(201);
      res.json({ message: 'Success!' });
      return;
    } catch (err) {
      res.status(err.code || 500);
      res.json({ errors: [err.message] });
      return;
    }
  }

  setTimeout(() => console.log('Simulating submission delay...'), 10000);

  res.status(201);
  res.json({ message: 'Success!' });
};

export default withSentry(handler);
