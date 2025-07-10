const User = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.signup = async (req,res)=>{

    const {  name, email, password  } = req.body;
    try{
        const existinguser = await User.findOne({email})
        if (existinguser) return res.status(400).json({msg:"user already exist"})

        const hashedpassword = await bcrypt.hash(password,10)
        const user = await User.create({ name,email,password:hashedpassword})
        res.status(201).json({msg:"'User created successfully' "})
        
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}


exports.login = async (req,res)=>{

    const { email, password  } = req.body;
    try{

        const loginuser = await User.findOne({email})
        if (!loginuser) return res.status(400).json({msg:"Invalid Credentials"})

        const isMatch = await bcrypt.compare(password ,loginuser.password);
        if (!isMatch) return res.status(400).json({msg:"Invalid Credentials"})
        
        const token = jwt.sign({userId:loginuser._id},JWT_SECRET,{ expiresIn: '7d' })
        res.json({ token, user: { id: loginuser._id, name: loginuser.name, email: loginuser.email } });
     
    }catch(err){
        res.status(500).json({ message: 'Server error'});
    }
}




