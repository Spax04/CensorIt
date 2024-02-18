import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import ScanningRouter from './routes/scanning';
import userRouter from './routes/user';
import authRouter from './routes/auth';


dotenv.config();
const PORT = process.env.PORT || 5000
const app = express();


app.use(cors())
app.use(express.json()) // pars request to JSON
app.use(express.urlencoded({extended:true})) // pars encoded request to JSON

app.use("/scanning",ScanningRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);


app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Failed to connect to MongoDB ' + error.message)
  })
