// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type Response = {
  name: string;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  res.status(200).json({ name: 'John Doe' });
};

export default handler;
