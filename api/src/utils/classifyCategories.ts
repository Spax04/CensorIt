import { ObjectId } from "bson";
import { createWebsite } from "../db/websites";
import { websiteWithId } from "../models/website";

async function classifyToCategories(dividedWords: Map<string, number>, amountOfWords: number, link: string) {
    let categoriesOfTheWebsite: Promise<websiteWithId>[] = [];
    for (let [key, value] of dividedWords) {
        if (100 * value / amountOfWords < 75) continue;
        const websiteId = createWebsite({
            link: link,
            categoryId: new ObjectId(key),
            blockPercentage: 100 * value / amountOfWords
        });
        categoriesOfTheWebsite.push(websiteId);
    }
    return await Promise.all(categoriesOfTheWebsite);
}

export default classifyToCategories;
