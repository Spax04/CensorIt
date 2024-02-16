import { Request, Response } from 'express';
export async function scanLink(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper link scanner.

  const { userId, link } = req.body;

  //! TEST
  console.log(req.body);

  return res.send({ message: 'Scanning Link' });
}

export async function scanText(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper text scanner.

  const { webPage, userId } = req.body;

  console.log(webPage);

  return res.send({ message: 'Scanning Text' });
}
