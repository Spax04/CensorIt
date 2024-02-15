import {Request ,Response} from 'express';
import { website, websiteModel } from '../models/website'; 
export async function scanLink(req: Request, res: Response): Promise<any> {
    // TODO: Implement a proper link scanner.
    try {

        const inputLink: website["link"] = req.body.link;
        const web: website | null = await websiteModel.findOne({ link: inputLink})
        
        if (web) {
            if (web.blockPercentage === 0) {
                res.send({ message: "allowed website"})
            } else {
                res.send({ blockPrecentage: web.blockPercentage });
            }
        } else {
            res.send({message: 'new link'})
        }
    } catch (error) {
        console.error("Error in scan link", error);
        res
          .status(500)
          .send({ message: "Internal server error", error: error.message });
    }
}

export async function scanText(req: Request, res: Response): Promise<any> {
    // TODO: Implement a proper text scanner.
}