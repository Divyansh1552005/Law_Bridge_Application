
import { signupPostRequestBodySchema, loginPostRequestBodySchema, updatePatchRequestBodySchemaforUser  } from "../validations/reqValidation.js";
import UserModel from "../models/userModel.js";
import { hashPasswordWithSalt, verifyPassword } from "../utils/hash.js";
import { createToken } from "../utils/token.js";
import { success } from "zod";

// creating user controller for signup

export const signupUser = async(req,res)=>{

    try{
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    

    if(validationResult.error){
        return res.status(400).json({
            error : validationResult.error.format(),
            success: false
        })
    }

    const { name, email, password } = validationResult.data;

    // check if user already exists with the same email
    const existingUser = await UserModel.findOne({ email });
    if(existingUser){
        return res.status(409).json({
            error : "User already exists with the same email",
            success : false
        })
    }

    // now hashing the password
    const {password: hashedPassword } = await hashPasswordWithSalt(password);

    // now creating new user
    const new_user = new UserModel({
        name,
        email,
        password: hashedPassword,
    });

    await new_user.save();

    // ab token create karna hai for that user
    const token = await createToken({ id: new_user._id.toString() });
    return res.status(201).json({
        message: "User created successfully",
        success: true,
        token
    });
}catch(error){
    console.error("Error in signupUser:", error);
    return res.status(500).json({
        error: "Internal Server Error",
        success: false
    }); 

}

};

// api to login user
export const loginUser = async(req,res)=>{
    try{
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({
            error : validationResult.error.format(),
            success: false
        })
    }

    const { email, password } = validationResult.data;

    // check if user exists with the email
    const existingUser = await UserModel.findOne({ email });
    if(!existingUser){
        return res.status(404).json({
            error : "User does not exist with the given email",
            success : false
        })
    }

    // now verify the password
    const isPasswordValid = await verifyPassword(password, existingUser.password);

    if(!isPasswordValid){
        return res.status(401).json({
            error : "Invalid password",
            success : false
        })
    }

    // ab token create karna hai for that user
    const token = await createToken({ id: existingUser._id.toString() });
    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token
    });
}catch(error){    
    console.error("Error in loginUser:", error);
    return res.status(500).json({
        error: "Internal Server Error",
        success: false
    }); 
}
};