import { Request, Response } from 'express';
import modifyWebPage from '../utils/modifyWebPage';
import classifyCategory from '../utils/classifyCategory';
import { userModel } from '../models/user';
import { ObjectId } from 'bson';
import { websiteModel } from '../models/website';
import { categoryModel } from '../models/category';
import classifyToCategories from '../utils/classifyCategories';
import { getUser } from '../db/users';
import { getCategory } from '../db/categories';


export async function scanLink(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper link scanner.

  const { userId, link } = req.body;


  const website = await websiteModel.findOne({ link: link });


  if (website) {
    const user = await userModel.findById(new ObjectId(userId));

    console.log("User: " + user);
    if (
      user.personalBlockPercentage == 25 ||
      (user.personalBlockPercentage == 50 && website.blockPercentage < 75) ||
      (user.personalBlockPercentage == 75 && website.blockPercentage < 25)
    ) {
      return res.status(200).json({ isExist: true, isAllowed: true });
    } else {
      const category = await categoryModel.findById(
        new ObjectId(website.categoryId)
      );
      return res.status(200).json({
        isExist: true,
        isAllowed: false,
        description: category.description,
      });
    }
  } else {
    return res.status(200).json({ isExist: false, isAllowed: true });
  }
}


function isNeedToBeBlocked(word: string, wordList: string[]): boolean {
  return wordList.includes(word);
}


// Your scanText function
const userChunksMap: Map<string, string[]> = new Map();

export async function scanText(req: Request, res: Response): Promise<void> {
  try {
    const { webPageChunk, userId, totalChunks, currentChunkIndex } = req.body;
    const user = await getUser(userId as ObjectId);
    if (!userChunksMap.has(userId)) {
      userChunksMap.set(userId, []);
    }
    userChunksMap.get(userId)![currentChunkIndex] = webPageChunk;
    if (userChunksMap.get(userId)!.length === totalChunks) {
      const completeWebPage = userChunksMap.get(userId)!.join('');
      userChunksMap.delete(userId);
      if (user.categoryList === null) {
        user.categoryList = [];
      }
      if (!user.wordList === null) {
        user.wordList = [];
      }
      const modifiedWebPage = modifyWebPage(completeWebPage, user.categoryList, user.wordList);
      const amountOfWords = completeWebPage.split(' ').length;
      const { modifiedPage, wordsAmount } = await modifiedWebPage;

      let x = classifyCategory(wordsAmount, amountOfWords);
      const websiteCategories = await classifyToCategories(wordsAmount, amountOfWords, req.headers.origin);
      const websiteWithWorstCategory = websiteCategories.sort(website => website.blockPercentage - user.personalBlockPercentage)[websiteCategories.length - 1];
      if (websiteWithWorstCategory.blockPercentage > user.personalBlockPercentage) {
        let category = await getCategory(websiteWithWorstCategory.categoryId);
        res.send({ 
          isAllowed: false,
          description: category.description
        });
        return;
      }


      res.send({ modifiedPage });
    } else {
      res.send({
        message: `Chunk ${currentChunkIndex + 1} of ${totalChunks} received.`,
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}
