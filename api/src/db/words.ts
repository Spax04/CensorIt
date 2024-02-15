import mongoose from 'mongoose';
import { word, wordModel, wordWithId } from '../models/word';
import dotenv from 'dotenv';

dotenv.config();

const createWord = (wordData: word) => {
    return new Promise<wordWithId>((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(() => {
            if (!wordModel.collection) {
                wordModel.createCollection();
            }
            const createdWord = wordModel.create(wordData).catch((error) => {
                reject(error);
            });
            resolve(createdWord as unknown as wordWithId);
        });
    });
}

const getWord = (id: mongoose.Types.ObjectId) => {
    return new Promise<wordWithId>(async (resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            if (!wordModel.collection) {
                wordModel.createCollection();
                reject("collection not found");
            }
            const foundWord = await wordModel.findById(id).exec().catch((error) => {
                reject(error);
            });
            resolve(foundWord as wordWithId);
        });
    });
};

const updateWord = (id: mongoose.Types.ObjectId, updatedWordData: Partial<word>) => {
    return new Promise<wordWithId>((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            if (!wordModel.collection) {
                wordModel.createCollection();
                reject("collection not found");
            }
            const updatedWord = await wordModel.findByIdAndUpdate(id, updatedWordData).exec().catch(err => {
                if (err || !updatedWord) {
                    reject(err ?? "Word not found");
                }
                resolve(updatedWord as wordWithId);
            }
            );
        });
    })
};

const deleteWord = (id: mongoose.Types.ObjectId) => {
    return new Promise<void>(async (resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            await wordModel.findByIdAndDelete(id).exec().catch(err => {
                if (err) {
                    reject(err);
                }
            });
            resolve();
        });
    });
};

export { createWord, getWord, updateWord, deleteWord };
