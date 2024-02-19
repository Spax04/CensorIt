import { getAllWords } from "../db/words";
import { ObjectId } from 'bson';
import { wordWithId } from "../models/word";


interface modifiedWebPageData {
    modifiedPage: string;
    wordsAmount: Map<string, number>;
}


const isNeedToCensured = (word: wordWithId, wordsWhitelist: ObjectId[], categoryWhiteList: ObjectId[]): boolean => {
    if (wordsWhitelist?.includes(word._id)) {
        return false;
    }
    if (categoryWhiteList?.includes(word.categoryId)) {
        return false;
    }
    return true;
}


export default async function modifyWebPage(allPage: string, categoryWhiteList: ObjectId[], wordsWhitelist: ObjectId[]): Promise<modifiedWebPageData> {
    return new Promise<modifiedWebPageData>(async (resolve) => {
        const allWords = await getAllWords();
        let wordMap = new Map<string, number>();
        allWords.forEach((word) => {
            const categoryId = word.categoryId.toString();
            const reg = new RegExp(`\\b${word.content}\\b`, 'gi');
            const censured = word.content[0] + '*'.repeat(word.content.length - 2) + word.content[word.content.length - 1];
            let count = (allPage.match(reg) || []).length;
            if (count) {
                if (!wordMap.has(categoryId)) {
                    wordMap.set(categoryId, 0);
                }
                let oldCount = wordMap.get(categoryId);
                wordMap.set(categoryId, oldCount! + count);
            }
            if (isNeedToCensured(word, wordsWhitelist, categoryWhiteList)) {
                allPage = allPage.replace(new RegExp(reg, 'gi'), censured);
            }
        })
        resolve({
            modifiedPage: allPage,
            wordsAmount: wordMap
        })
    })
}
