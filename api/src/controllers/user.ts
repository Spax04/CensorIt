import { Request, Response } from 'express';
import { createUser } from '../db/users';


export async function register(req: Request, res: Response): Promise<any> {
    const { mail, password } = req.body;
    if (!mail || !password) {
        return res.status(400).json({ error: "Invalid username or password" });
    }

    const newUser = await createUser({
        email: {
            address: mail,
        },
        password: password,
        categoryList: [],
        websiteList: [],
        wordList: [],
        personalBlockPercentage: 0
    })
    return res.status(200).json({ message: "User registered successfully", id: newUser._id });
}