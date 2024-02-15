import express, {Request, Response} from "express";
import { scanLink, scanText } from "../controllers/scanning";

const ScanningRouter = express.Router();

ScanningRouter.get("/link", (req: Request, res: Response) => {
    return scanLink(req, res); 
});

ScanningRouter.get("/text", (req: Request, res: Response) => {
    return scanText(req, res);
});

export default ScanningRouter;
