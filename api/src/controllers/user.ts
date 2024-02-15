import { Request, Response } from 'express';
import { updateUser } from '../db/users';
import { ObjectId } from 'bson';
import { userWithId } from '../models/user';


export async function editWhiteCategory(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    console.log(id);
    const { newCategoryList } = req.body;
    if (!id || !newCategoryList) {
        return res.status(400).json({ error: "Invalid id or categories" });
    }
    const user = await updateUser(new ObjectId(id), {
        categoryList: newCategoryList,
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    })
    return res.status(200).json({ message: "category list updated", id: (user as userWithId)._id });
}

export async function editWhiteWebsite(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    const { newWebsiteList } = req.body;
    if (!id || !newWebsiteList) {
        return res.status(400).json({ error: "Invalid id or websites" });
    }
    const user = await updateUser(new ObjectId(id), {
        websiteList: newWebsiteList,
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    })
    return res.status(200).json({ message: "website list updated", id: (user as userWithId)._id });
}

export async function editWhiteWord(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    const { newWordList } = req.body;
    if (!id || !newWordList) {
        return res.status(400).json({ error: "Invalid id or words" });
    }
    const user = await updateUser(new ObjectId(id), {
        wordList: newWordList,
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    })
    return res.status(200).json({ message: "word list updated", id: (user as userWithId)._id });
}

export async function editPersonalBlockPercentage(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    const { newPercentage } = req.body;
    if (!id || !newPercentage) {
        return res.status(400).json({ error: "Invalid id or percentage" });
    }
    const user = await updateUser(new ObjectId(id), {
        personalBlockPercentage: newPercentage,
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    })
    return res.status(200).json({ message: "personal block percentage updated", id: (user as userWithId)._id });
}