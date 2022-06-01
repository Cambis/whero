/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import type { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import type { NextApiResponse } from 'next';

import { NextApiMiddlewareHandler, FormidableNextApiRequest } from 'lib/api/types';

/**
 * Authenticate form submissions to DatoCMS using JWT.
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param next
 * A function that is used to advance the request
 */
const authenticateFormSubmission: NextApiMiddlewareHandler = async <T = any>(
  req: FormidableNextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
): Promise<void> => {
  if (!req.fields.token) {
    return next(new Error('Missing parameters from request'));
  }

  verify(req.fields.token as string, process.env.NEXT_JWT_SECRET || 'secret', (err) => {
    if (err) {
      return next(new Error('Not authorised'));
    }
  });

  next();
};

export default authenticateFormSubmission;
