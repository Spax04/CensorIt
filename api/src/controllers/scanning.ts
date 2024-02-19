import { Request, Response } from 'express';
import modifyWebPage from '../utils/modifyWebPage';
import classifyCategories from '../utils/classifyCategories';
import { getUser } from '../db/users';
import { ObjectId } from 'bson';


export async function scanLink(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper link scanner.

  const { userId, link } = req.body;

  //! TEST
  // console.log(req.body);

  return res.send({ message: 'Scanning Link' });
}



// Your scanText function
const userChunksMap: Map<string, string[]> = new Map();

export async function scanText(req: Request, res: Response): Promise<void> {
  try {
    console.log(req.body)
    const { webPageChunk, userId, totalChunks, currentChunkIndex } = req.body;
    console.log("user id", userId);
    const user = await getUser(userId as ObjectId);
    if (!userChunksMap.has(userId)) {
      userChunksMap.set(userId, []);
    }
    userChunksMap.get(userId)![currentChunkIndex] = webPageChunk;
    if (userChunksMap.get(userId)!.length === totalChunks) {
      const completeWebPage = userChunksMap.get(userId)!.join('');
      userChunksMap.delete(userId);
      console.log('Complete web ');
      console.log(user)
      if (user.categoryList === null) {
        user.categoryList = [];
      }
      if (!user.wordList === null) {
        user.wordList = [];
      }
      const modifiedWebPage = modifyWebPage(completeWebPage, user.categoryList, user.wordList);
      console.log('Complete web ');
      const amountOfWords = completeWebPage.split(' ').length;
      const { modifiedPage, wordsAmount } = await modifiedWebPage;
      classifyCategories(wordsAmount, amountOfWords, req.headers.origin);
      res.send({ modifiedPage });
    } else {
      res.send({ message: `Chunk ${currentChunkIndex + 1} of ${totalChunks} received.` });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

