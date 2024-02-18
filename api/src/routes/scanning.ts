import express, {Request, Response} from "express";
import { scanLink, scanText } from "../controllers/scanning";

const ScanningRouter = express.Router();

ScanningRouter.post("/link", (req: Request, res: Response) => {
    return scanLink(req, res); 
});

ScanningRouter.post("/text", (req: Request, res: Response) => {
    return scanText(req, res);
});

export default ScanningRouter;
