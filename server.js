import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'


dotenv.config();
const app = express();
app.use(cors({
    origin:[
    'http://localhost:5173'
    ],
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());


app.get('/' , async (req , res)=>{
  res.send('server is running');
})

app.use('/auth' , authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("mongodb connected");
    app.listen(process.env.PORT , () =>{
        console.log("server is running");
    })
})
.catch((err) =>{
    console.log("db error" , err);
})