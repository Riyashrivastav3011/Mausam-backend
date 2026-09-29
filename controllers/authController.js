import User from '../models/auth.js'
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'


//create user
export const createUser = async (req , res) =>{
    try{
     const {name , email , mobile , password } = req.body;
     const exist = await User.findOne({email})
     if(exist){
        return res.status(400).json({message:"Email already resgistered"})
     }
     const salt = await bcrypt.genSalt(10);
     const hashed = await bcrypt.hash(password , salt);
     const user = new User({name , email , mobile , password:hashed});
     await user.save();
     const secret = process.env.JWT_SECRET;
     const token = JWT.sign({id:user._id , email:user.email} , secret , {expiresIn:'5d'});
     res.cookie("token", token, {
  httpOnly: true,
  secure: true, 
  sameSite: "none",
  maxAge: 5 * 24 * 60 * 60 * 1000
});
     res.status(200).json({
        success:true,
        message:'user created',
        token        
     })
    }catch (err) {
  console.error("SIGNUP ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Creation failed",
    error: err.message,
  });
}
}


export const loginUser = async (req , res) =>{
   try{
const { email , password } = req.body;
const user = await User.findOne({email});

if(!user){
    return res.status(500).json({message:'invalid credentials'})
}
const match = await bcrypt.compare(password , user.password)
if(!match){
    return res.status(500).json({message:'invalid credentials'})
} 
 const token = JWT.sign({ id: user._id, email: user.email },
 process.env.JWT_SECRET, { expiresIn: '1d' });
 res.cookie('token' , token , {
    httpOnly:true,
    sameSite:'none',
    secure:true,
    maxAge: 24 * 60 * 60 * 1000 
});
res.status(200).json({
    message:'logged in'})

}catch(err){
    console.log(err);
    res.status(500).json({message:'server error'})
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