/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * A wrapper that is used to call middleware functions.
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param fn
 * A NextApiMiddlewareHandler type function
 */
const runMiddleware = async <T = any, Result = any>(
  req: NextApiRequest,
  res: NextApiResponse<T>,
  fn: any,
) =>
  new Promise<Result>((resolve, reject) => {
    fn(req, res, (result: Result | Error) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });

export default runMiddleware;
