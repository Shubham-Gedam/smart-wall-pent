import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function registerController(req,res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        email
    });
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"Email already exists"
        })
    };

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    },process.env.JWT_SECRET,{
        expiresIn:"2d"
    })
    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        token: token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    })
}

export async function loginController(req,res) {
    const { email, password } = req.body;


    const user = await userModel.findOne({ email }).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if(!isMatch){
         return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    },process.env.JWT_SECRET,{
        expiresIn:"2d"
    })

    res.cookie("token",token,{
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 100,
    })

    res.status(200).json({
    message: "User logged in successfully",
    token: token, 
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
});
}

export async function logoutController(req,res) {

    res.clearCookie("token",{
        httpOnly: true,
        sameSite: "none",
        secure: true
    })

    return res.status(200).json({
        message:"Logged out Successfully"
    })
}