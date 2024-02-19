import { Request, Response } from 'express';
import { getUser, updateUser } from '../db/users';
import { ObjectId } from 'bson';
import { userModel, userWithId } from '../models/user';
import { wordModel } from '../models/word';
import { website, websiteModel } from '../models/website';
import { categoryModel } from '../models/category';
import { createWebsite } from '../db/websites';

export async function editWhiteCategory(
  req: Request,
  res: Response
): Promise<any> {
  const id = req.params.id;
  console.log(id);
  const { newCategoryList } = req.body;
  if (!id || !newCategoryList) {
    return res.status(400).json({ error: 'Invalid id or categories' });
  }
  try {
    // Iterate through each word in the newWordList
    for (const categoryInList of newCategoryList) {
      // Search for the word in the database
      const category = await categoryModel.findOne({
        name: categoryInList.name,
      });

      if (category) {
        // If the word exists, add its ObjectId to the user's wordList
        await updateUserCategoryList(id, category._id);
      } else {
        console.log(`Word not found: ${categoryInList}`);
      }
    }

    return res.status(200).json({ isSucceed: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserCategoryList(
  userId: string,
  categoryId: ObjectId
): Promise<void> {
  await userModel.updateOne(
    { _id: userId },
    { $addToSet: { categoryList: categoryId } } // Use $addToSet to avoid duplicate entries
  );
}

export async function editWhiteWebsite(req: Request, res: Response): Promise<any> {
  const userId = req.params.id;
  const { newWebsiteList } = req.body;

  console.log(newWebsiteList);
  if (!userId || !newWebsiteList || !Array.isArray(newWebsiteList)) {
    return res.status(400).json({ error: 'Invalid id or websites' });
  }

  try {
    // Clear the user's websiteList before updating
    await userModel.updateOne({ _id: userId }, { $set: { websiteList: [] } });

    // Iterate through each website in the newWebsiteList
    for (const websiteInList of newWebsiteList) {
      // Search for the website in the database
      const website = await websiteModel.findOne({ link: websiteInList.link });

      if (website) {
        // If the website exists, add its ObjectId to the user's websiteList
        await userModel.updateOne(
          { _id: userId },
          { $addToSet: { websiteList: website._id } } // Use $addToSet to avoid duplicate entries
        );
      } else {
        console.log(`Website not found: ${websiteInList.link}`);
        // If the website doesn't exist, you may choose to handle this case as needed.
        // For example, you could create a new website entry in the database.
              //!!!!! Remove this part,in use inly for adding new websites to db
        const newWebSite = new websiteModel({
          link: websiteInList.link,
          blockPercentage: 100,
          categoryId: new ObjectId('65cdcc2316ad1f411aa12a4d'),
        });

        await createWebsite(newWebSite);

        //!!!!
      }
    }

    return res.status(200).json({ isSucceed: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



async function updateUserWebsiteList(
  userId: string,
  websiteId: ObjectId
): Promise<void> {
  await userModel.updateOne(
    { _id: userId },
    { $addToSet: { websiteList: websiteId } } // Use $addToSet to avoid duplicate entries
  );
}

export async function editWhiteWord(req: Request, res: Response): Promise<any> {
  const userId = req.params.id;
  const { newWordList } = req.body;
  
  if (!userId || !newWordList || !Array.isArray(newWordList)) {
    return res.status(400).json({ error: 'Invalid id or words' });
  }

  try {
    // Clear the user's wordList before updating
    await userModel.updateOne({ _id: userId }, { $set: { wordList: [] } });

    // Iterate through each word in the newWordList
    for (const wordInList of newWordList) {
      // Search for the word in the database
      const word = await wordModel.findOne({ content: wordInList.content });

      if (word) {
        // If the word exists, add its ObjectId to the user's wordList
        await userModel.updateOne(
          { _id: userId },
          { $addToSet: { wordList: word._id } } // Use $addToSet to avoid duplicate entries
        );
      } else {
        console.log(`Word not found: ${wordInList.content}`);
      }
    }

    return res.status(200).json({ isSucceed: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



export async function editPersonalBlockPercentage(
  req: Request,
  res: Response
): Promise<any> {
  const id = req.params.id;
  const { newPercentage } = req.body;

  if (!id || !newPercentage) {
    return res.status(400).json({ error: 'Invalid id or percentage' });
  }
  try {
    const user = await updateUser(new ObjectId(id), {
      personalBlockPercentage: newPercentage,
    });
    return res.status(200).json({ isSucceed: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserLists(req: Request, res: Response): Promise<any> {
  const id = req.params.id;

  try {
    const { wordList, categoryList, websiteList } = await getUser(
      new ObjectId(id)
    );

    // Fetch complete data for each item in the wordList
    const words = await wordModel.find({ _id: { $in: wordList } });

    // Fetch complete data for each item in the categoryList
    const categories = await categoryModel.find({ _id: { $in: categoryList } });

    // Fetch complete data for each item in the websiteList
    const websites = await websiteModel.find({ _id: { $in: websiteList } });

    // Map the fetched data to include both ID and other properties
    const wordData = words.map((word) => ({
      id: word._id,
      content: word.content,
    }));
    const categoryData = categories.map((category) => ({
      id: category._id,
      name: category.name,
      description: category.description,
    }));
    const websiteData = websites.map((website) => ({
      id: website._id,
      link: website.link,
      blockPercentage: website.blockPercentage,
    }));

    console.log(wordData);
    console.log(categoryData);
    console.log(websiteData);
    return res.status(200).json({
      wordList: wordData,
      categoryList: categoryData,
      websiteList: websiteData,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
