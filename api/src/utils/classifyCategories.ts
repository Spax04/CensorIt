import { ObjectId } from "bson";
import { createWebsite } from "../db/websites";

function classifyCategories(dividedWords: Map<string, number>, amountOfWords: number, link: string) {
    for (let [key, value] of dividedWords) {
        createWebsite({
            link: link,
            categoryId: new ObjectId(key),
            blockPercentage: 100 * value / amountOfWords
        });
    }
}

export default classifyCategories;
