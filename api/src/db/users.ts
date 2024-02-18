import mongoose from 'mongoose';
import { user, userModel, userWithId } from '../models/user';


const createUser = (userData: user) => {
    return new Promise<userWithId>((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(() => {
            if (!userModel.collection) {
                userModel.createCollection();
            }
            const createdUser = userModel.create(userData).catch(error => {
                reject(error);
            });
            resolve(createdUser as unknown as userWithId);
        })
    });
}

const getUser = (id: mongoose.Types.ObjectId) => {
    return new Promise<userWithId>((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            if (!userModel.collection) {
                userModel.createCollection();
                reject("collection not found");
            }
            const foundUser = await userModel.findById(id).exec().catch((error) => {
                reject(error);
            });
            resolve(foundUser as userWithId);
        })
    });
};

const updateUser = (id: mongoose.Types.ObjectId, updatedUserData: Partial<user>) => {
    return new Promise<userWithId>((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            if (!userModel.collection) {
                userModel.createCollection();
                reject("collection not found");
            }
            const updatedUser = await userModel.findByIdAndUpdate(id, updatedUserData).exec().catch(err => {
                if (err || !updatedUser) {
                    reject(err ?? "user not found");
                }
                resolve(updatedUser as userWithId);
            })
        });
    })
};

const deleteUser = (id: mongoose.Types.ObjectId) => {
    return new Promise<void>(async (resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL as string).then(async () => {
            await userModel.findByIdAndDelete(id).exec().catch(err => {
                if (err) {
                    reject(err);
                }
            });
            resolve();
        });
    })
}



export { createUser, getUser, updateUser, deleteUser };
