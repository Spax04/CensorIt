import { getAllWords } from "../db/words";


export default async function modifyWebPage(allPage: string): Promise<string> {
    return new Promise<string>(async (resolve) => {

        // allPage = allPage.replace(/\bass\b/g, '**');

        // <style>, <ma style=""> 

        // make sure not to touch anything inside the script tag and the style tag
        // const scriptReg = /<script[^>]*>((.|[\n\r])*)<\/script>/im;
        // const styleReg = /<style[^>]*>((.|[\n\r])*)<\/style>/im;
        // const scriptWebPage = allPage.match(scriptReg);
        // const styleWebPage = allPage.match(styleReg);
        // let scriptWebPageString = '';
        // let styleWebPageString = '';
        // if (scriptWebPage) {
        //     scriptWebPageString = scriptWebPage[0];
        // }
        // if (styleWebPage) {
        //     styleWebPageString = styleWebPage[0];
        // }
        const allWords = await getAllWords();
        allWords.forEach((word) => {
            let reg = new RegExp(`\\b${word.content}\\b`, 'gi');
            let censured = word.content[0] + '*'.repeat(word.content.length - 2) + word.content[word.content.length - 1];
            allPage = allPage.replace(new RegExp(reg, 'gi'), censured)
        })
        // allPage = allPage.replace(scriptReg, scriptWebPageString);
        // allPage = allPage.replace(styleReg, styleWebPageString);
        resolve(allPage)
    })
}



