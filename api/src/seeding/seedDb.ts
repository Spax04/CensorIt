import { createCategory } from "../db/categories";
import { createWord } from "../db/words";
import { insultWords, pornWords, violenceWords } from "./seedWords";
import { ObjectId } from "bson";

console.log("seeding db...");

const listOfWordList: any[][] = [[pornWords], [violenceWords], [insultWords]];

createCategory({
    name: "pornography",
    description: "contains sexually explicit content"
}).then((category) => {
    listOfWordList[0].push(category._id);
})
createCategory({
    name: 'violence',
    description: 'Contains violent content'
}).then((category) => {
    listOfWordList[1].push(category._id);
})
createCategory({
    name: "insult",
    description: "contains insults"
}).then((category) => {
    listOfWordList[2].push(category._id);
})


for (let listWord of listOfWordList) {
    for (let word of listWord[0]) {
        createWord({
            content: word,
            categoryId: new ObjectId(listWord[1])
        });
    }
}

console.log('Database seeded!');
