import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const  generateToken = ( id , role ) =>{
   return JWT.sign({id , role} , process.env.JWT_SECRET , {
    expiresIn:'3d',
   });
}

export default generateToken;