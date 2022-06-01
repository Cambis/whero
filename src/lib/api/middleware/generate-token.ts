/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import type { NextApiResponse } from 'next';

import { NextApiMiddlewareHandler, FormidableNextApiRequest } from 'lib/api/types';

/**
 * Generates a token that is used to authenticate a submission to DatoCMS.
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param next
 * A function that is used to advance the request
 */
const generateToken: NextApiMiddlewareHandler = async <T = any>(
  req: FormidableNextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
): Promise<void> => {
  const token = sign({ query: req.query }, process.env.NEXT_JWT_SECRET || 'secret', {
    expiresIn: 10,
  });
  req.token = token;

  next();
};

export default generateToken;
