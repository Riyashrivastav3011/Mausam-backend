import { createUser , loginUser , saveLocation , getLocation } from '../controllers/authController.js';
import express from 'express'
import verifyToken from '../utils/verifyToken.js'


const router = express.Router();

router.post('/signup' , createUser);
router.post('/login' , loginUser);
router.put("/savelocation", verifyToken, saveLocation);
router.get("/getlocation", verifyToken, getLocation);



export default router;