/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction } from 'express';
import type { NextApiResponse } from 'next';

import { NextApiMiddlewareHandler, FormidableNextApiRequest } from 'lib/api/types';

/**
 * Used to verify that a submission extends the IFormSubmission interface.
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param next
 * A function that is used to advance the request
 */
const validateSubmissionData: NextApiMiddlewareHandler = async <T = any>(
  req: FormidableNextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
): Promise<void> => {
  const { formName, firstName, lastName, email, recaptcha, honeyPot } = req.fields;

  if (!formName || !firstName || !lastName || !email || !recaptcha) {
    next(new Error('Missing parameters from request'));
  }

  if (honeyPot) {
    next(new Error('Bot detected [honeypot]'));
  }

  next();
};

export default validateSubmissionData;
