import jwt, {JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { user } from '../models/user'; 

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authorization: string | undefined = req.headers.authorization
    if (authorization) {
      const token: string = authorization.slice(7, authorization.length) // Bearer XXXXXX
      jwt.verify(token, process.env.JWT_PW as string , (err: Error, decode: string | JwtPayload) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' })
        } else {
          req.user = decode
          next()
        }
      })
    } else {
      res.status(401).send({ message: 'No Token' })
    }
  }

export const generateToken = (user: user): string => {
  return jwt.sign(
    { email: user.email }, // add _id: user._id later (userWithId)
    process.env.JWT,
    { expiresIn: "15d" }
  );
};