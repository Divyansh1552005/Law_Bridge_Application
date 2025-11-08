import UserModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import {verifyPassword, hashPasswordWithSalt } from "../utils/hash.js";
import { v2 as cloudinary } from "cloudinary";
import { addLawyerByAdminSchema } from "../validations/reqValidation.js";


export const addlawyer = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ 
        success: false,
        message: "Image file is required" 
      });
    }

    // Parse address if it's a string
    if (req.body.address && typeof req.body.address === 'string') {
      try {
        req.body.address = JSON.parse(req.body.address);
      } catch (error) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid address format. Address must be a valid JSON object" 
        });
      }
    }

    // validate request body
    const validatedData = await addLawyerByAdminSchema.parseAsync(req.body);
    const {name,email,password,speciality,degree,experience,about,fees,address} = validatedData;

    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

    // check if lawyer with the same email already exists
    const existingLawyer = await lawyerModel.findOne({ email: validatedData.email });
    if (existingLawyer) {
      return res.status(400).json({ message: "Lawyer with this email already exists" });
    }



    // hashing password 
    const { salt, password: hashedPassword } = await hashPasswordWithSalt(password);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
    const imageUrl = imageUpload.secure_url

    // create new lawyer
    const newLawyer = new lawyerModel({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: {
        Location: address.Location || '',
        City: address.City || '',
        State: address.State || ''
      },
      date: Date.now(),
    });

    // save lawyer to database
    await newLawyer.save(); 
    res.status(201).json({ success : true, message: "Lawyer added successfully"});

  } catch (error) {
    console.error("Error adding lawyer:", error);
    res.status(500).json({ success : false, message: "Internal server error" });
  }
};


