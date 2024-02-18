import { getAllWords } from "../db/words";


export default async function modifyWebPage(allPage: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
        const allWords = await getAllWords();
        allWords.forEach((word) => {
            let reg = new RegExp(`\\b${word.content}\\b`, 'gi');
            let censured = word.content[0] + '*'.repeat(word.content.length - 2) + word.content[word.content.length - 1];
            allPage = allPage.replace(new RegExp(reg, 'gi'), censured)
        })
        resolve(allPage)
    })
}



