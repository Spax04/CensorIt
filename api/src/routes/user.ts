import express, {Request, Response} from "express";
import { editPersonalBlockPercentage, getUserLists,editWhiteCategory, editWhiteWebsite, editWhiteWord } from "../controllers/user";

const userRouter = express.Router();


userRouter.put("/:id/white-category", (req: Request, res: Response) => {
    return editWhiteCategory(req, res);
})

userRouter.put("/:id/white-website", (req: Request, res: Response) => {
    return editWhiteWebsite(req, res);
})

userRouter.put("/:id/white-word", (req: Request, res: Response) => {
    return editWhiteWord(req, res);
})

userRouter.put("/:id/personal-block-percentage", (req: Request, res: Response) => {
    return editPersonalBlockPercentage(req, res);
})

userRouter.get("/:id/white-lists", (req: Request, res: Response) => {
    return getUserLists(req, res);
})


export default userRouter;
