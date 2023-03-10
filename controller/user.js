import bycrpt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try{
        const existingUser = await User.findOne({email});

        if (!existingUser) {
        return res.status(404).json({message : "User dosn't exist"});
        }

        const isPasswordCorrect = bycrpt.compare(password,existingUser.password);
        if(!isPasswordCorrect){
            res.status(400).json({message : "Invaild Password"});
        }

        const token = jwt.sign({ email:existingUser.email , id:existingUser._id},'test',{expiresIn : "1hr"});

        res.status(200).json({result : existingUser,token})
    }catch(error){
      
        res.status(500).json({message:'Something went wrong.'});
    }
}
export const signup = async (req, res) => {
    const { email,password,confirmPassword,FirstName,LastName} = req.body;
    try{
        const existingUser = await User.findOne({email});

        if (existingUser) {
        return res.status(400).json({message : "User already exist"});
        }

        if(password !== confirmPassword){
            res.status(400).json({message : "Invaild Password"});
        }
        const hashedPassword = await bycrpt.hash(password,12);
       
        const user = User.create({email,password:hashedPassword,name:`${FirstName} ${LastName}`});

        const token = jwt.sign({ email:user.email , id:user._id},'test',{expiresIn : "1hr"});

        res.status(200).json({user,token})

    }catch(error){  
        res.status(500).json({message:'Something went wrong.'});
    }
}