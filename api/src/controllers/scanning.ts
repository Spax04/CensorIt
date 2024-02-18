import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import modifyWebPage from '../utils/modifyWebPage';
export async function scanLink(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper link scanner.

  const { userId, link } = req.body;

  //! TEST
  console.log(req.body);

  return res.send({ message: 'Scanning Link' });
}



// Your scanText function
const userChunksMap: Map<string, string[]> = new Map();

export async function scanText(req: Request, res: Response): Promise<void> {
  try {
    const { webPageChunk, userId, totalChunks, currentChunkIndex } = req.body;
    if (!userChunksMap.has(userId)) {
      userChunksMap.set(userId, []);
    }
    userChunksMap.get(userId)![currentChunkIndex] = webPageChunk;
    if (userChunksMap.get(userId)!.length === totalChunks) {
      const completeWebPage = userChunksMap.get(userId)!.join('');
      userChunksMap.delete(userId);
      const modifiedWebPage = await modifyWebPage(completeWebPage);
      res.send({ modifiedWebPage });
    } else {
      res.send({ message: `Chunk ${currentChunkIndex + 1} of ${totalChunks} received.` });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}
