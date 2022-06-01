/* eslint-disable import/no-anonymous-default-export */
import { withSentry } from '@sentry/nextjs';
import Cors from 'cors';
import { Files } from 'formidable';
import type { NextApiResponse, NextApiHandler } from 'next';

import {
  validateSubmissionData,
  verifyRecaptcha,
  sendMail,
  runMiddleware,
  useFormidable,
  generateToken,
} from 'lib/api';
import type {
  IFormSubmission,
  DatoSingleAssetField,
  FormidableNextApiRequest,
} from 'lib/api/types';

type Request = IFormSubmission & {
  [key: string]: string | string[] | DatoSingleAssetField;
};

type Response = {
  message?: string;
  errors?: string[];
  token?: string;
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
    await runMiddleware<Response>(req, res, validateSubmissionData);
  } catch (err) {
    res.status(401);
    res.json({ errors: [err.message] });
  }

  try {
    await runMiddleware<Response>(req, res, verifyRecaptcha);
  } catch (err) {
    res.status(401);
    res.json({ errors: [err.message] });
  }

  const fields = { ...req.fields } as Request;
  const files = { ...req.files } as Files;

  try {
    await Promise.all([
      sendMail<Request>(fields, files),
      runMiddleware<Response>(req, res, generateToken),
    ]);

    res.status(200);
    res.json({ message: 'Success!', token: req?.token });
  } catch (err) {
    console.log(err);
    res.status(err.code || 500);
    res.json({ errors: [err.message] });
  }
};

export default withSentry(handler);
