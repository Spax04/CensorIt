import express, { Request, Response } from 'express';
import { isCorrectPassword, signIn, signUp } from '../controllers/auth'; 

const authRouter = express.Router();

authRouter.post('/signIn', (req: Request, res: Response) => {
    return signIn(req, res);
});

authRouter.post('/signUp', (req: Request, res: Response) => {
    return signUp(req, res);
});

authRouter.post('/passCheck', (req: Request, res: Response) => {
    return isCorrectPassword(req, res);
})

export default authRouter;