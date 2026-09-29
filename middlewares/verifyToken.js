import dotenv from 'dotenv'
import JWT from 'jsonwebtoken'

dotenv.config();
const  SECRET = process.env.JWT_SECRET

const verifyToken = (req , res , next) =>{
    const token = req.cookies.token;
    JWT.verify(token , SECRET , (error , decoded)=>{
        if(error){
            return res.send(({
              msg:"invalid token",
              success:false
            }))
        }   
        req.userId = decoded.id;
        next();
    })
}
export default verifyToken;