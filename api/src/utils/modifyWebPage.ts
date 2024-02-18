// import { Types } from "mongoose";
import { getAllWords } from "../db/words";
import { word } from "../models/word";
import { ObjectId } from 'bson';



interface modifiedWebPageData {
    modifiedPage: string;
    wordsAmount: Map<string, number>;
}


export default async function modifyWebPage(allPage: string): Promise<modifiedWebPageData> {
    return new Promise<modifiedWebPageData>(async (resolve) => {
        const allWords = await getAllWords();
        let wordMap = new Map<string, number>();
        allWords.forEach((word) => {
            const categoryId = word.categoryId.toString();
            const reg = new RegExp(`\\b${word.content}\\b`, 'gi');
            const censured = word.content[0] + '*'.repeat(word.content.length - 2) + word.content[word.content.length - 1];
            let count = (allPage.match(reg) || []).length;
            if (count) {
                console.log(`Word: ${word.content}, Count: ${count}`);

                if (!wordMap.has(categoryId)) {
                    wordMap.set(categoryId, 0);
                }
                let oldCount = wordMap.get(categoryId);
                wordMap.set(categoryId, oldCount! + count);
            }
            allPage = allPage.replace(new RegExp(reg, 'gi'), censured);
            console.table(wordMap);
        })
        console.table(wordMap);
        resolve({
            modifiedPage: allPage,
            wordsAmount: wordMap
        })
    })
}
