import User from '../models/auth.js'
import  generateToken  from '../utils/generateToken.js'
import bcrypt from 'bcrypt';


export const createUser = async (req , res) => {
  try{
       const {name , email , password , mobile } = req.body;
    const exist = await User.findOne({email});
    if(exist){
      return res.status(400).json({message:'Email already registered'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password  , salt);
     
      const userData ={ name , email , mobile, password:hashed }    
    
     const user= await User.create(userData);
     const token = generateToken(user._id , user.role);
     
     return res.status(200).json({messssage:'user created successfully' , token , user})
  }
  catch(err){
    console.log(err);
    res.status(400).json({message:'server error' , err});
  } 
}


export const loginUser = async (req , res) =>{
   try{
     const {email , password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:'invalid email'})
    }

    const match = await bcrypt.compare(password , user.password);
    if(!match){
        return res.status(400).json({message:'invalid password'});
    }

    const token = generateToken(user._id , user.role);
    
    res.cookie('token' , token , {
        httpOnly:true,
        sameSite:'none',
        secure:true,
        maxAge: 24 * 60 * 60 * 1000 
    });
    console.log(token);
    res.status(200).json({message:'logged in' , 
      user:{email:user.email , role:user.role , name:user.name}})
   }
   catch(err){
    console.log(err)
    res.status(400).json({message:'server error' , err});
   }
}


// Locations sve
export const saveLocation = async (req, res) => {
  try {
    const { city, state, latitude, longitude } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { location: { city, state, latitude, longitude } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Location saved",
      location: user.location,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /user/location  -> saved location wapas lo (home page pe kaam aayega)
export const getLocation = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ location: user.location });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};