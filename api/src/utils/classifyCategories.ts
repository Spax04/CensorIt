import { ObjectId } from 'bson';
import { createWebsite } from '../db/websites';
import { websiteWithId } from '../models/website';

async function classifyToCategories(
  dividedWords: Map<string, number>,
  amountOfWords: number,
  link: string
) {
  console.log('in here');
  let categoriesOfTheWebsite: Promise<websiteWithId>[] = [];
  for (let [key, value] of dividedWords) {
    console.log('Amount: ' + amountOfWords);
    console.log('Pre category: ' + value);
    console.log(100 * ((value / amountOfWords) - 1));
    let explicitProcent = Math.abs(100 * ((value / amountOfWords) - 1))
    console.log(explicitProcent);
  
    if (explicitProcent < 75) continue;
    const websiteId = createWebsite({
      link: link,
      categoryId: new ObjectId(key),
      blockPercentage: explicitProcent,
    });

    console.log(websiteId);

    categoriesOfTheWebsite.push(websiteId);
  }
  return await Promise.all(categoriesOfTheWebsite);
}

export default classifyToCategories;
