import express, {Request, Response} from "express";
import { register } from "../controllers/user";

const userRouter = express.Router();

userRouter.post("/register", (req: Request, res: Response) => {
    return register(req, res);
});

// userRouter.put("/white-category", (req: Request, res: Response) => {
//     return editWhiteCategory(req, res);
// })

// userRouter.put("/white-website", (req: Request, res: Response) => {
//     return editWhiteWebsite(req, res);
// })

// userRouter.put("/white-word", (req: Request, res: Response) => {
//     return editWhiteWord(req, res);
// })



export default userRouter;