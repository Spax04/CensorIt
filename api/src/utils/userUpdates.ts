import { ObjectId } from 'bson'
import { getUser, updateUser } from '../db/users'


const getCategoryList = async (userId: ObjectId) => {
    const user = await getUser(userId);
    return user.categoryList;
}

const addCategory = async (userId: ObjectId, categoryId: ObjectId) => {
    const user = await getUser(userId);
    let newCategoryList = [...user.categoryList, categoryId];
    await updateUser(userId, { categoryList: newCategoryList });
    return user;
}

const removeCategory = async (userId: ObjectId, categoryId: ObjectId) => {
    const user = await getUser(userId);
    let newCategoryList = user.categoryList.filter((id) => id !== categoryId);
    await updateUser(userId, { categoryList: newCategoryList });
    return user;
}

const getWebsiteList = async (userId: ObjectId) => {
    const user = await getUser(userId);
    return user.websiteList;
}

const addWebsite = async (userId: ObjectId, websiteId: ObjectId) => {
    const user = await getUser(userId);
    let newWebsiteList = [...user.websiteList, websiteId];
    await updateUser(userId, { websiteList: newWebsiteList });
    return user;
}

const removeWebsite = async (userId: ObjectId, websiteId: ObjectId) => {
    const user = await getUser(userId);
    let newWebsiteList = user.websiteList.filter((id) => id !== websiteId);
    await updateUser(userId, { websiteList: newWebsiteList });
    return user;
}

const getWordList = async (userId: ObjectId) => {
    const user = await getUser(userId);
    return user.wordList;
}

const addWord = async (userId: ObjectId, word: ObjectId) => {
    const user = await getUser(userId);
    let newWordList = [...user.wordList, word];
    await updateUser(userId, { wordList: newWordList });
    return user;
}

const removeWord = async (userId: ObjectId, word: ObjectId) => {
    const user = await getUser(userId);
    let newWordList = user.wordList.filter((w) => w !== word);
    await updateUser(userId, { wordList: newWordList });
    return user;
}


export {
    getCategoryList, addCategory, removeCategory,
    getWebsiteList, addWebsite, removeWebsite,
    getWordList, addWord, removeWord
}
