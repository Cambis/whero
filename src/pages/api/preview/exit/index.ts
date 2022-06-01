/* eslint-disable import/no-anonymous-default-export */
import type { NextApiHandler } from 'next';

const exitPreviewHandler: NextApiHandler = async (req, res) => {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  // Redirect the user back to the index page.
  res.writeHead(307, { Location: req.query.slug || '/' });
  res.end();
};

export default exitPreviewHandler;
